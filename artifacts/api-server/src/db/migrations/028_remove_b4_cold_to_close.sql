-- Migration 028: Remove B4 (Cold-to-Close Sequence Builder) and renumber bonus resources
-- B5→B4, B6→B5, B7→B6, B8→B7

-- Remove B4
DELETE FROM resource_center_tools WHERE id = 26 AND code = 'B4';

-- Renumber the remaining bonus resources
UPDATE resource_center_tools SET code = 'B4', sort_order = 4 WHERE id = 27 AND code = 'B5';
UPDATE resource_center_tools SET code = 'B5', sort_order = 5 WHERE id = 28 AND code = 'B6';
UPDATE resource_center_tools SET code = 'B6', sort_order = 6 WHERE id = 29 AND code = 'B7';
UPDATE resource_center_tools SET code = 'B7', sort_order = 7 WHERE id = 30 AND code = 'B8';
