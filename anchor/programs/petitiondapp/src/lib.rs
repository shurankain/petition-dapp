#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod petitiondapp {
    use super::*;

  pub fn close(_ctx: Context<ClosePetitiondapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.petitiondapp.count = ctx.accounts.petitiondapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.petitiondapp.count = ctx.accounts.petitiondapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializePetitiondapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.petitiondapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializePetitiondapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Petitiondapp::INIT_SPACE,
  payer = payer
  )]
  pub petitiondapp: Account<'info, Petitiondapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct ClosePetitiondapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub petitiondapp: Account<'info, Petitiondapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub petitiondapp: Account<'info, Petitiondapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Petitiondapp {
  count: u8,
}
