use crate::auth;
use crate::storage::rental_store;
use crate::types::NFTMetadata;
use ic_cdk_macros::*;

#[query]
pub fn get_my_nfts() -> Result<Vec<NFTMetadata>, String> {
    let caller = auth::require_authenticated()?;
    Ok(rental_store::get_nfts_by_owner(&caller))
}

#[query]
pub fn get_nft_by_id(nft_id: u64) -> Result<NFTMetadata, String> {
    let caller = auth::require_authenticated()?;

    let nft = rental_store::get_nft(nft_id).ok_or_else(|| "NFT not found".to_string())?;

    if nft.owner != caller {
        return Err("Access denied".to_string());
    }

    Ok(nft)
}

#[query]
pub fn get_nft_metadata(nft_id: u64) -> Result<NFTMetadata, String> {
    rental_store::get_nft(nft_id).ok_or_else(|| "NFT not found".to_string())
}
