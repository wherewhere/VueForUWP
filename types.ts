/// <reference types="./vite.env" />

export interface IWinJSControl {
    /**
     * Creates a new AppBar object.
     * @param element The DOM element that will host the control.
     * @param options The set of properties and values to apply to the new AppBar.
     */
    new(element?: any, options?: any): any;
}