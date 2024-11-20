import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Petitiondapp} from '../target/types/petitiondapp'

describe('petitiondapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Petitiondapp as Program<Petitiondapp>

  const petitiondappKeypair = Keypair.generate()

  it('Initialize Petitiondapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        petitiondapp: petitiondappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([petitiondappKeypair])
      .rpc()

    const currentCount = await program.account.petitiondapp.fetch(petitiondappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Petitiondapp', async () => {
    await program.methods.increment().accounts({ petitiondapp: petitiondappKeypair.publicKey }).rpc()

    const currentCount = await program.account.petitiondapp.fetch(petitiondappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Petitiondapp Again', async () => {
    await program.methods.increment().accounts({ petitiondapp: petitiondappKeypair.publicKey }).rpc()

    const currentCount = await program.account.petitiondapp.fetch(petitiondappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Petitiondapp', async () => {
    await program.methods.decrement().accounts({ petitiondapp: petitiondappKeypair.publicKey }).rpc()

    const currentCount = await program.account.petitiondapp.fetch(petitiondappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set petitiondapp value', async () => {
    await program.methods.set(42).accounts({ petitiondapp: petitiondappKeypair.publicKey }).rpc()

    const currentCount = await program.account.petitiondapp.fetch(petitiondappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the petitiondapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        petitiondapp: petitiondappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.petitiondapp.fetchNullable(petitiondappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
