import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { idlFactory, createActor } from '../../../declarations/Aangan_backend';
import { _SERVICE as AanganService } from '../../../declarations/Aangan_backend/Aangan_backend.did';

interface ICPContextType {
    isAuthenticated: boolean;
    identity: Identity | null;
    principal: Principal | null;
    user: any | null;
    actor: AanganService | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    createUser: (role: 'Landlord' | 'Tenant', name?: string, email?: string, phone?: string) => Promise<any>;
    updateProfile: (name?: string, email?: string, phone?: string) => Promise<any>;
}

const ICPContext = createContext<ICPContextType | undefined>(undefined);

export const useICP = () => {
    const context = useContext(ICPContext);
    if (!context) {
        throw new Error('useICP must be used within an ICPProvider');
    }
    return context;
};

interface ICPProviderProps {
    children: React.ReactNode;
}

export const ICPProvider: React.FC<ICPProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [identity, setIdentity] = useState<Identity | null>(null);
    const [principal, setPrincipal] = useState<Principal | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [actor, setActor] = useState<AanganService | null>(null);
    const [loading, setLoading] = useState(true);
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);

    // Get canister ID from environment variables
    const canisterId = import.meta.env.VITE_CANISTER_ID_AANGAN_BACKEND;
    const internetIdentityCanisterId = import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY;



    // Internet Identity URL - use local for development, mainnet for production
    const II_URL = import.meta.env.VITE_DFX_NETWORK === 'local'
        ? `http://${internetIdentityCanisterId}.localhost:4943/`
        : 'https://identity.ic0.app';

    useEffect(() => {
        initAuth();
    }, []);

    const initAuth = async () => {
        try {
            // Check if canister ID is available
            if (!canisterId) {
                console.error('Backend canister ID not found. Please set VITE_CANISTER_ID_AANGAN_BACKEND in your .env file');
                setLoading(false);
                return;
            }

            const authClient = await AuthClient.create({
                idleOptions: {
                    idleTimeout: 1000 * 60 * 30, // 30 minutes
                    disableDefaultIdleCallback: true,
                },
            });
            setAuthClient(authClient);

            if (await authClient.isAuthenticated()) {
                const identity = authClient.getIdentity();
                const principal = identity.getPrincipal();

                setIdentity(identity);
                setPrincipal(principal);
                setIsAuthenticated(true);

                // Create actor with authenticated identity
                const host = import.meta.env.VITE_DFX_NETWORK === 'local'
                    ? 'http://localhost:4943'
                    : 'https://ic0.app';
                const agent = new HttpAgent({
                    identity,
                    host,
                });

                // Only fetch root key for local development
                if (import.meta.env.VITE_DFX_NETWORK === "local") {
                    try {
                        await agent.fetchRootKey();
                    } catch (err) {
                        console.warn("Unable to fetch root key:", err);
                    }
                }

                const actor = Actor.createActor(idlFactory, {
                    agent,
                    canisterId,
                }) as AanganService;
                console.log('Created actor with canister ID:', canisterId);
                setActor(actor);

                // Fetch user profile
                await fetchUserProfile(actor);
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async (actorInstance: AanganService) => {
        try {
            const result = await actorInstance.get_my_profile();
            if ('Ok' in result) {
                setUser(result.Ok);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const login = async () => {
        if (!authClient) {
            throw new Error('Auth client not initialized');
        }

        if (!canisterId) {
            throw new Error('Backend canister ID not found. Please set VITE_CANISTER_ID_AANGAN_BACKEND in your .env file');
        }

        try {
            setLoading(true);

            await new Promise<void>((resolve, reject) => {
                authClient.login({
                    identityProvider: II_URL,
                    windowOpenerFeatures: 'toolbar=0,location=0,menubar=0,width=500,height=500,left=100,top=100',
                    onSuccess: resolve,
                    onError: (error) => {
                        console.error('Internet Identity login error:', error);
                        reject(error);
                    },
                    derivationOrigin: window.location.origin,
                });
            });

            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal();

            setIdentity(identity);
            setPrincipal(principal);
            setIsAuthenticated(true);

            // Create actor with authenticated identity
            const host = import.meta.env.VITE_DFX_NETWORK === 'local'
                ? 'http://localhost:4943'
                : 'https://ic0.app';
            const agent = new HttpAgent({
                identity,
                host,
            });

            // Only fetch root key for local development
            if (import.meta.env.VITE_DFX_NETWORK === "local") {
                try {
                    await agent.fetchRootKey();
                } catch (err) {
                    console.warn("Unable to fetch root key:", err);
                }
            }

            const actor = Actor.createActor(idlFactory, {
                agent,
                canisterId,
            }) as AanganService;
            console.log('Created actor in login with canister ID:', canisterId);
            setActor(actor);

            // Try to fetch user profile
            await fetchUserProfile(actor);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        if (!authClient) return;

        try {
            setLoading(true);
            await authClient.logout();

            setIsAuthenticated(false);
            setIdentity(null);
            setPrincipal(null);
            setUser(null);
            setActor(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (role: 'Landlord' | 'Tenant', name?: string, email?: string, phone?: string) => {
        if (!actor) throw new Error('Not authenticated');

        try {
            const roleVariant = role === 'Landlord' ? { 'Landlord': null } : { 'Tenant': null };
            const result = await actor.create_user(
                roleVariant,
                name ? [name] : [],
                email ? [email] : [],
                phone ? [phone] : []
            );

            if ('Ok' in result) {
                setUser(result.Ok);
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    };

    const updateProfile = async (name?: string, email?: string, phone?: string) => {
        if (!actor) throw new Error('Not authenticated');

        try {
            const result = await actor.update_user_profile(
                name ? [name] : [],
                email ? [email] : [],
                phone ? [phone] : []
            );

            if ('Ok' in result) {
                setUser(result.Ok);
                return result.Ok;
            } else {
                throw new Error(result.Err);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    const value: ICPContextType = {
        isAuthenticated,
        identity,
        principal,
        user,
        actor,
        login,
        logout,
        loading,
        createUser,
        updateProfile,
    };

    return <ICPContext.Provider value={value}>{children}</ICPContext.Provider>;
};
