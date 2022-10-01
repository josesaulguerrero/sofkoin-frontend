import { createFeatureSelector } from '@ngrx/store';
import { MarketModel } from 'src/app/models/marketmodel';

export const selectMarket = createFeatureSelector<MarketModel>('market');
