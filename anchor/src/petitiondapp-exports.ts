// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import PetitiondappIDL from '../target/idl/petitiondapp.json'
import type { Petitiondapp } from '../target/types/petitiondapp'

// Re-export the generated IDL and type
export { Petitiondapp, PetitiondappIDL }

// The programId is imported from the program IDL.
export const PETITIONDAPP_PROGRAM_ID = new PublicKey(PetitiondappIDL.address)

// This is a helper function to get the Petitiondapp Anchor program.
export function getPetitiondappProgram(provider: AnchorProvider) {
  return new Program(PetitiondappIDL as Petitiondapp, provider)
}

// This is a helper function to get the program ID for the Petitiondapp program depending on the cluster.
export function getPetitiondappProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Petitiondapp program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return PETITIONDAPP_PROGRAM_ID
  }
}
