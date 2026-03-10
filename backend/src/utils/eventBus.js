import { EventEmitter } from "events";

const eventBus = new EventEmitter();

// Set max listeners to avoid memory leak warnings if many listeners are added
eventBus.setMaxListeners(20);

export default eventBus;
