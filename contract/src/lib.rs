#![no_std]

use soroban_sdk::{contract, contractimpl, Address, Env, String, Symbol};

#[contract]
pub struct MiniDona;

#[contractimpl]
impl MiniDona {
    pub fn donate(env: Env, donor: Address, amount: i128, category: String) {
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let total_key = Symbol::short("total");
        let donor_key = Symbol::short("donor");

        let current_total: i128 = env
            .storage()
            .persistent()
            .get(&total_key)
            .unwrap_or(0i128);

        let new_total = current_total + amount;
        env.storage().persistent().set(&total_key, &new_total);
        env.storage().persistent().set(&donor_key, &donor);

        env.events().publish(
            (Symbol::short("donation"),),
            (donor, amount, category),
        );
    }

    pub fn get_total_donated(env: Env, _category: String) -> i128 {
        let total_key = Symbol::short("total");
        env.storage()
            .persistent()
            .get(&total_key)
            .unwrap_or(0i128)
    }

    pub fn get_last_donor(env: Env, _category: String) -> Address {
        let donor_key = Symbol::short("donor");
        env.storage()
            .persistent()
            .get(&donor_key)
            .expect("No donor found")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn test_donate_and_get_total() {
        let env = Env::default();
        env.register_contract(None, MiniDona);
        let donor = Address::random(&env);
        let category = String::from_slice(&env, "Health");
        let amount = 1_000_000i128;
        MiniDona::donate(env.clone(), donor, amount, category.clone());
        let total = MiniDona::get_total_donated(env, category);
        assert_eq!(total, amount);
    }

    #[test]
    fn test_get_last_donor() {
        let env = Env::default();
        env.register_contract(None, MiniDona);
        let donor1 = Address::random(&env);
        let donor2 = Address::random(&env);
        let category = String::from_slice(&env, "Education");
        MiniDona::donate(env.clone(), donor1, 1_000_000i128, category.clone());
        MiniDona::donate(env.clone(), donor2.clone(), 2_000_000i128, category.clone());
        let last_donor = MiniDona::get_last_donor(env, category);
        assert_eq!(last_donor, donor2);
    }

    #[test]
    fn test_multiple_categories() {
        let env = Env::default();
        env.register_contract(None, MiniDona);
        let donor = Address::random(&env);
        let health = String::from_slice(&env, "Health");
        let education = String::from_slice(&env, "Education");
        MiniDona::donate(env.clone(), donor.clone(), 1_000_000i128, health.clone());
        MiniDona::donate(env.clone(), donor.clone(), 2_000_000i128, education.clone());
        let health_total = MiniDona::get_total_donated(env.clone(), health);
        let education_total = MiniDona::get_total_donated(env, education);
        assert_eq!(health_total, 1_000_000i128);
        assert_eq!(education_total, 2_000_000i128);
    }

    #[test]
    fn test_multiple_donations_accumulate() {
        let env = Env::default();
        env.register_contract(None, MiniDona);
        let donor1 = Address::random(&env);
        let donor2 = Address::random(&env);
        let category = String::from_slice(&env, "Environment");
        MiniDona::donate(env.clone(), donor1.clone(), 10_000_000i128, category.clone());
        MiniDona::donate(env.clone(), donor2.clone(), 20_000_000i128, category.clone());
        let total = MiniDona::get_total_donated(env, category);
        assert_eq!(total, 30_000_000i128);
    }
}
