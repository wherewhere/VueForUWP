/// <reference types="./env" />

export interface IWinJSControl {
    /**
     * Creates a new WinJS control object.
     * @param element The DOM element that will host the control.
     * @param options The set of properties and values to apply to the new control.
     */
    new(element?: any, options?: any): any;
}