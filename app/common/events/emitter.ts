import {EventEmitter} from 'events';
import {EventTypes} from './types';
import _ from 'lodash';

class EmitterAdapter {
    private ee: EventEmitter;
    private subscriptions: {
        uid: string;
        type: string;
        cb: (data: any) => void;
    }[] = [];
    constructor() {
        this.ee = new EventEmitter();
    }
    // uid - A unique id to identify a specific purpose listener
    addListener = (
        type: EventTypes | string,
        cb: (data: any) => void,
        uid: string,
    ) => {
        this.ee.addListener(type.toString(), cb);
        this.subscriptions.push({uid, type, cb});
    };
    removeSubscription = (uid: string) => {
        const s = _.find(this.subscriptions, o => o.uid === uid);
        if (s) {
            this.ee.removeAllListeners(s.type.valueOf());
        }
    };
    removeAllListeners = () => {
        if (this.subscriptions.length > 0) {
            this.subscriptions.forEach(s =>
                this.ee.removeAllListeners(s.type.valueOf()),
            );
        }
    };
    removeAllListenersOfType = (t: EventTypes) => {
        _.filter(this.subscriptions, o => o.type === t.valueOf()).forEach(s =>
            this.ee.removeAllListeners(s.type),
        );
    };
    emit = (t: EventTypes, o?: object) => {
        this.ee.emit(t.valueOf(), o);
    };
}

export const GlobalEventEmitter = new EmitterAdapter();
