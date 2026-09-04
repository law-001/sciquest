import ChromatidPull from './ChromatidPull';
import ChromatinCondense from './ChromatinCondense';
import ChromosomeAlign from './ChromosomeAlign';
import CleavageFurrow from './CleavageFurrow';
import CrossingOver from './CrossingOver';
import DnaReplication from './DnaReplication';
import NuclearEnvelope from './NuclearEnvelope';
import SpindleAttach from './SpindleAttach';

// Every procedure takes ({ onComplete, onStarsUpdate, ...stepProps }) and
// reports back with onComplete({ stars: 0..3 }).
export const PROCEDURES = {
  dnaReplication: DnaReplication,
  chromatinCondense: ChromatinCondense,
  spindleAttach: SpindleAttach,
  chromosomeAlign: ChromosomeAlign,
  chromatidPull: ChromatidPull,
  crossingOver: CrossingOver,
  nuclearEnvelope: NuclearEnvelope,
  cleavageFurrow: CleavageFurrow,
};

// How long each procedure gets before it times out at zero stars. Generous —
// the timer is there to keep things moving, not to be the difficulty.
export const PROCEDURE_SECONDS = {
  dnaReplication: 60,
  chromatinCondense: 30,
  spindleAttach: 60,
  chromosomeAlign: 50,
  chromatidPull: 50,
  crossingOver: 60,
  nuclearEnvelope: 60,
  cleavageFurrow: 45,
};
