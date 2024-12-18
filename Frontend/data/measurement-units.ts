import { Measurement, MeasurementUnit } from '../obscuritas-media-manager-backend-client';

export const MeasurementUnits = [
    new MeasurementUnit({ measurement: Measurement.Mass, name: 'Kilogram', shortName: 'kg', multiplier: 1000 }),
    new MeasurementUnit({ measurement: Measurement.Mass, name: 'Gram', shortName: 'g', multiplier: 1 }),
    new MeasurementUnit({ measurement: Measurement.Mass, name: 'Milligram', shortName: 'mg', multiplier: 0.001 }),
    new MeasurementUnit({ measurement: Measurement.Volume, name: 'Liter', shortName: 'l', multiplier: 1 }),
    new MeasurementUnit({ measurement: Measurement.Volume, name: 'Milliliter', shortName: 'ml', multiplier: 0.001 }),
    new MeasurementUnit({ measurement: Measurement.Size, name: 'Kilometer', shortName: 'km', multiplier: 1000 }),
    new MeasurementUnit({ measurement: Measurement.Size, name: 'Meter', shortName: 'm', multiplier: 1 }),
    new MeasurementUnit({ measurement: Measurement.Size, name: 'Millimeter', shortName: 'mm', multiplier: 0.001 }),
    new MeasurementUnit({ measurement: Measurement.Piece, name: 'Stück', shortName: 'Stk', multiplier: 1 }),
    new MeasurementUnit({ measurement: Measurement.Pinch, name: 'Prise', shortName: 'Prise', multiplier: 1 }),
    new MeasurementUnit({ measurement: Measurement.Unitless, name: 'Unitless', shortName: '', multiplier: 1 }),
];
