export interface IErrorObserver {
    onError(error: Readonly<Error>): void;
}
