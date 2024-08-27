import {create} from "zustand";

const useStore = create((set, get) => ({
    user: null,
    token: "",

    setUser: val => set({user: val}),
    setToken: val => set({token: val}),

}))

export default useStore