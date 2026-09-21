import { clamp, defu, isClient } from '../../shared';
import type { Direction } from '../../types';
import type { ProgressOptions } from './types';

const defaultOptions: Required<ProgressOptions> = {
  direction: 'ltr',
  minimum: 0.08,
  maximum: 1,
  easing: 'linear',
  speed: 200,
  trickle: true,
  trickleSpeed: 200
};

// oxlint-disable-next-line typescript/no-extraneous-class
class ProgressObserver {
  static options: Required<ProgressOptions> = defaultOptions;
  static status: number | null = null;

  // Queue for animation functions
  private static pending: Array<(next: () => void) => void> = [];
  private static isPaused: boolean = false;
  private static trickleTimer: ReturnType<typeof setTimeout> | undefined;

  // Reset the progress
  static reset(): typeof ProgressObserver {
    this.status = null;
    this.isPaused = false;
    this.pending = [];
    this.options = defaultOptions;
    this.clearTrickleTimer();
    return this;
  }

  // Configure typeof ProgressObserver with new options
  static configure(options: Partial<ProgressOptions>): typeof ProgressObserver {
    this.options = defu({ ...options }, this.options);
    return this;
  }

  // Check if BProgress has started
  static isStarted(): boolean {
    return typeof this.status === 'number';
  }

  static isRendered(): boolean {
    if (!isClient) {
      return false;
    }

    return document.querySelector('[data-vean-progress-provider]') !== null;
  }

  /**
   * Set the progress status.
   * This method updates the progress status for every progress element present in the DOM.
   * If a template is provided, it will create a new progress element if one does not already exist.
   * If the template is null, it relies on user-inserted elements.
   */
  static set(n: number): typeof ProgressObserver {
    if (!isClient || this.isPaused) return this;

    const started = this.isStarted();
    // Clamp n between minimum and maximum
    n = clamp(n, this.options.minimum, this.options.maximum);
    // Reset status if maximum is reached
    this.status = n === this.options.maximum ? null : n;

    if (this.status === null) {
      this.clearTrickleTimer();
    }

    const progressElements = this.render(!started);
    const speed = this.options.speed;
    const ease = this.options.easing;

    // Force repaint on each element
    progressElements.forEach(progress => progress.offsetWidth);

    // Queue the animation function
    this.queue((next: () => void) => {
      // Animate the bar on all progress elements
      progressElements.forEach(progress => {
        // Animate the bar in determined mode
        const bar = progress.querySelector('[data-vean-progress-bar]') as HTMLElement;
        toCss(bar, this.barPositionCSS({ n, speed, ease }));
      });

      if (n === this.options.maximum) {
        // When the bar reaches maximum, make it semi-transparent to indicate completion
        progressElements.forEach(progress => {
          toCss(progress, { transition: 'none', opacity: '1' });
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          progress.offsetWidth; // Repaint
        });
        setTimeout(() => {
          progressElements.forEach(progress => {
            toCss(progress, {
              transition: `all ${speed}ms ${ease}`,
              opacity: '0'
            });
          });
          setTimeout(() => {
            // Remove each progress element from the DOM
            progressElements.forEach(progress => {
              this.remove(progress);
              toCss(progress, { transition: 'none', opacity: '1' });
            });

            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  }

  // Start the progress bar
  static start(): typeof ProgressObserver {
    if (!isClient) return this;
    if (!this.status) this.set(0);

    if (this.options.trickle) this.startTrickling();

    return this;
  }

  // Complete the progress
  static done(force?: boolean): typeof ProgressObserver {
    if (!isClient) return this;
    if (!force && !this.status) return this;
    return this.inc(0.3 + 0.5 * Math.random()).set(1);
  }

  // Increment the progress
  static inc(amount?: number): typeof ProgressObserver {
    if (this.isPaused) return this;

    let n = this.status;

    if (!n) {
      return this.start();
    } else if (n > 1) {
      return this;
    } else {
      if (typeof amount !== 'number') {
        if (n >= 0 && n < 0.2) {
          amount = 0.1;
        } else if (n >= 0.2 && n < 0.5) {
          amount = 0.04;
        } else if (n >= 0.5 && n < 0.8) {
          amount = 0.02;
        } else if (n >= 0.8 && n < 0.99) {
          amount = 0.005;
        } else {
          amount = 0;
        }
      }
      n = clamp(n + amount, 0, 0.994);
      return this.set(n);
    }
  }

  // Decrement the progress
  static dec(amount?: number): typeof ProgressObserver {
    if (this.isPaused) return this;

    let n = this.status;

    if (typeof n !== 'number') return this;
    if (typeof amount !== 'number') {
      if (n > 0.8) {
        amount = 0.1;
      } else if (n > 0.5) {
        amount = 0.05;
      } else if (n > 0.2) {
        amount = 0.02;
      } else {
        amount = 0.01;
      }
    }

    n = clamp(n - amount, 0, 0.994);
    return this.set(n);
  }

  // Advance the progress (trickle)
  static trickle(): typeof ProgressObserver {
    if (this.isPaused) return this;
    return this.inc();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static promise(input: any): typeof ProgressObserver {
    const resolved = typeof input === 'function' ? input() : input;

    if (!resolved) {
      return this;
    }

    if (typeof resolved.then === 'function') {
      this.start();

      Promise.resolve(resolved).then(
        () => {
          this.done();
        },
        () => {
          this.done(true);
        }
      );

      return this;
    }

    if (typeof resolved.state !== 'function' || typeof resolved.always !== 'function') {
      return this;
    }

    if (resolved.state() === 'resolved') {
      return this;
    }

    let initial = 0;
    let current = 0;

    this.start();
    initial++;
    current++;

    resolved.always(() => {
      current--;
      if (current === 0) {
        initial = 0;
        this.done();
      } else {
        this.set((initial - current) / initial);
      }
    });

    return this;
  }

  /**
   * Renders the BProgress component.
   * If a template is provided, it will create a progress element if none exists in the parent.
   * If the template is null, it relies on the user to insert their own elements marked with the "vean-progress" class.
   * When using indeterminate mode with a custom template, the template should include the indeterminate element.
   */
  static render(fromStart: boolean = false): HTMLElement[] {
    if (!isClient) {
      return [];
    }

    const progressElements: HTMLElement[] = Array.from(
      document.querySelectorAll('[data-vean-progress-provider]')
    ) as HTMLElement[];

    // Common initialization logic for all progress elements
    progressElements.forEach(progress => {
      progress.style.display = '';

      // Determined mode: show the progress bar and hide the indeterminate element
      const bar = progress.querySelector('[data-vean-progress-bar]') as HTMLElement;
      const percent = fromStart
        ? toBarPercent(0, this.options.direction)
        : toBarPercent(this.status || 0, this.options.direction);
      toCss(
        bar,
        this.barPositionCSS({
          n: this.status || 0,
          speed: this.options.speed,
          ease: this.options.easing,
          percent
        })
      );

      if (typeof this.status === 'number') {
        progress.setAttribute('aria-valuenow', `${this.status}`);
      } else {
        progress.removeAttribute('aria-valuenow');
      }
    });

    return progressElements;
  }

  /**
   * Remove the progress element from the DOM.
   * If a progress element is provided, only that element is removed;
   * otherwise, all progress elements and associated classes are removed.
   * For user-provided templates (when options.template === null), the element
   * is hidden instead of being removed.
   */
  static remove(progressElement?: HTMLElement): void {
    if (!isClient) {
      return;
    }

    this.clearTrickleTimer();

    if (progressElement) {
      // For user-provided templates, hide the element instead of removing it.
      progressElement.style.display = 'none';
    } else {
      const progresses = document.querySelectorAll('[data-vean-progress-provider]');
      progresses.forEach(progress => {
        const elem = progress as HTMLElement;
        // Hide the element instead of removing it.
        elem.style.display = 'none';
      });
    }
  }

  // Pause the progress
  static pause(): typeof ProgressObserver {
    if (!this.isStarted()) return this;
    this.isPaused = true;
    this.clearTrickleTimer();
    return this;
  }

  // Resume the progress
  static resume(): typeof ProgressObserver {
    // Return early if progress was never started
    if (!this.isStarted()) return this;

    // Set isPaused to false to allow progress updates
    this.isPaused = false;

    if (this.options.trickle) this.startTrickling();

    return this;
  }

  // Queue function for animations
  private static queue(fn: (next: () => void) => void): void {
    this.pending.push(fn);
    if (this.pending.length === 1) {
      this.next();
    }
  }

  private static next(): void {
    const fn = this.pending.shift();
    if (fn) {
      fn(this.next.bind(this));
    }
  }

  private static clearTrickleTimer(): void {
    if (this.trickleTimer) {
      clearTimeout(this.trickleTimer);
      this.trickleTimer = undefined;
    }
  }

  private static startTrickling(): void {
    if (this.trickleTimer || this.isPaused || !this.isStarted()) {
      return;
    }

    const tick = () => {
      this.trickleTimer = undefined;

      if (this.isPaused || !this.isStarted()) {
        return;
      }

      this.trickle();

      if (!this.isPaused && this.isStarted()) {
        this.trickleTimer = setTimeout(tick, this.options.trickleSpeed);
      }
    };

    this.trickleTimer = setTimeout(tick, this.options.trickleSpeed);
  }

  // Compute the CSS for positioning the bar
  private static barPositionCSS({
    n,
    speed,
    ease,
    percent
  }: {
    n: number;
    speed: number;
    ease: string;
    percent?: number;
  }): {
    [key: string]: string;
  } {
    const computedPercent = percent ?? toBarPercent(n, this.options.direction);

    const barCSS: { [key: string]: string } = {
      transform: `translate3d(${computedPercent}%,0,0)`,
      transition: `all ${speed}ms ${ease}`
    };

    return barCSS;
  }
}

export const progress = ProgressObserver;

function toBarPercent(n: number, direction: Direction): number {
  if (direction === 'rtl') return (1 - n) * 100;

  return (-1 + n) * 100;
}

function toCss(element: HTMLElement, properties: { [key: string]: string | undefined } | string, value?: string): void {
  if (typeof properties === 'string') {
    if (value !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      element.style[properties as any] = value;
    }
  } else {
    for (const prop in properties) {
      if (properties.hasOwnProperty(prop)) {
        const val = properties[prop];
        if (val !== undefined) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          element.style[prop as any] = val;
        }
      }
    }
  }
}
