export interface BuildConfig
{
    readonly Parameters: BuildParameters;
}


export interface BuildParameters
{
    readonly ConnectInstanceId : string;
    readonly ConnnectInstanceName: string;
    readonly ConnectQueues : Array<string>;
}