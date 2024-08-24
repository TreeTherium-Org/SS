use anchor_lang::prelude::*;

declare_id!("DowGMszf41NQpgKBfSnvcJk3Ca7e1sKG5J2oLcSoDEaq");

#[program]
pub mod solana_vote {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.question_id = 0;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, question_id: u32, vote: bool) -> Result<()> {
        let vote_account = &mut ctx.accounts.vote_account;
        vote_account.question_id = question_id;
        vote_account.vote = vote;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 4)]
    pub state: Account<'info, State>,
    #[account(signer, mut)]
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(init, payer = user, space = 8 + 4 + 1)]
    pub vote_account: Account<'info, VoteAccount>,
    #[account(signer, mut)]
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct State {
    pub question_id: u32,
}

#[account]
pub struct VoteAccount {
    pub question_id: u32,
    pub vote: bool,
}
