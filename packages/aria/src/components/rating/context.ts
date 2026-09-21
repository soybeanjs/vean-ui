import { useContext } from '../../composables';
import type { RatingRootContext } from './types';

export const [provideRatingRootContext, useRatingRootContext] = useContext<RatingRootContext>('RatingRoot');
