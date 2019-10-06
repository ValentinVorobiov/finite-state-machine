class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if( !config ){ throw new Error() } else {
            if( config.states ){
                this.states = config.states;
            } else {
                throw new Error();
            }
            if( config.initial ){
                this.initialState = config.initial;
                this.currentState = this.initialState;
                this.eventsHistory = [];
            } else {
                this.initialState = Object.keys( this.states )[ 0 ];
                this.currentState = this.initialState;
                this.eventsHistory = [];
            }
            this.eventsHistory.push( 
                { event: 'initConfig', initState: this.initialState, newState: this.currentState }
            );
            this.eventPointer = this.eventsHistory.length;
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentState;
    }

    checkEventsHistory(){
        if( this.eventPointer !== this.eventsHistory.length ){
            while( this.eventsHistory.length > this.eventPointer ){
                this.eventsHistory.pop();
            }
        }
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {

        let prevState = this.currentState;
        if( this.states[ state ] ){
            this.currentState = state;
        } else {
            throw new Exception( '#changeState, Invalid @state !' )
        }
        this.checkEventsHistory();
        this.eventsHistory.push( 
            { event: 'changeState', prevState: prevState, newState : this.currentState }
        );
        this.eventPointer = this.eventsHistory.length;

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let allowedTransitions = this.states[ this.currentState ].transitions;
        let prevState = this.currentState;
        if( allowedTransitions[ event ] ){
            this.currentState = allowedTransitions[ event ] ;
            this.checkEventsHistory;
            this.eventsHistory.push( 
                { event: 'trigger', prevState: prevState, newState : this.currentState }
            );
            this.eventPointer = this.eventsHistory.length;
        } else {
            throw new Exception( '#trigger, Invalid @event!' );
        }

    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentState = this.initialState;
        this.eventsHistory = [];
        this.eventsHistory.push(
            { event: 'reset', initState: this.initialState, newState: this.currentState }
        );
        this.eventPointer = this.eventsHistory.length;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let statesList = Object.keys( this.states );
        let allowedStates = [];
        if( !event ){
            return statesList;
        } else {
            for( let stateName in this.states ){
                let eventTransitions = this.states[ stateName ].transitions;
                if( eventTransitions[ event ] ){
                    allowedStates.push( stateName );
                }
            }
            return allowedStates;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo( ) {
        if( this.eventPointer < 2 ){
            return false;
        } else {
            if( 
            this.eventsHistory[ this.eventPointer - 1 ].event == 'changeState' ||
            this.eventsHistory[ this.eventPointer - 1 ].event == 'trigger' ){
                this.currentState = this.eventsHistory[ this.eventPointer -1 ].prevState;
                this.eventPointer -=1;
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {

        if( this.eventsHistory.length == 1 ){
            return false;
        } else {
            if( this.eventPointer < this.eventsHistory.length ){
                this.eventPointer +=1;
                this.currentState = this.eventsHistory[ this.eventPointer - 1 ].newState;
                return true;
            } else {
                return false;
            }
        }

    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.eventsHistory = [];
        this.eventPointer = this.eventsHistory.length;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
