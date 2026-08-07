import { IPersistentObject } from "../../class/abstract/PersistentObject"

export type New<T extends IPersistentObject> = Omit<T, keyof IPersistentObject>