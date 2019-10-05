class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config) {
            throw new Error();
        }
        this.history = null;
        this.reHistory = null;
        this.config = config;
        this.isError = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.config.initial;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        this.reHistory = null;
        for (let key in this.config.states) {
            if (key === state) {
                this.history = this.config.initial;
                this.config.initial = state;
                return;
            }
        }
        throw new Error();
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        this.reHistory = null;
        if(this.isError) {
            throw new Error();
        }
        for (let key in this.config.states) {
            if (this.config.states[key].transitions[event]) {
                this.history = this.config.initial;
                this.config.initial = this.config.states[key].transitions[event];
                return;
            }
        }
        this.isError = true;
        throw new Error();
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.config.initial = 'normal';
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let result = [];
        if(event) {
            for (let key in this.config.states) {
                if (this.config.states[key].transitions[event]) {
                    result.push(key);
                }
            }
            return result;
        }
        return Object.keys(this.config.states);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if(!this.history) {
            return false;
        }
        if(this.history) {
            this.reHistory = this.config.initial;
            this.config.initial = this.history;
            this.history = null;
            return true;
        }
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if(!this.reHistory) {
            return false;
        }
        if(this.reHistory) {
            this.config.initial = this.reHistory;
            this.history = this.config.initial;
            this.reHistory = null;
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = null;
        this.reHistory = null;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
