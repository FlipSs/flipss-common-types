import {IErrorObserver, IValueObserver} from "./internal";

export type Observer<T> = IValueObserver<Readonly<T>> | IErrorObserver;
