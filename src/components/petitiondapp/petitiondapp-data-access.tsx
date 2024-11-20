'use client'

import {getPetitiondappProgram, getPetitiondappProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function usePetitiondappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getPetitiondappProgramId(cluster.network as Cluster), [cluster])
  const program = getPetitiondappProgram(provider)

  const accounts = useQuery({
    queryKey: ['petitiondapp', 'all', { cluster }],
    queryFn: () => program.account.petitiondapp.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['petitiondapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ petitiondapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function usePetitiondappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = usePetitiondappProgram()

  const accountQuery = useQuery({
    queryKey: ['petitiondapp', 'fetch', { cluster, account }],
    queryFn: () => program.account.petitiondapp.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['petitiondapp', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ petitiondapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['petitiondapp', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ petitiondapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['petitiondapp', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ petitiondapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['petitiondapp', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ petitiondapp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
