import Emitter from "component-emitter";

class Event {}

const eventBus = new Event();
Emitter(eventBus);

export default eventBus;
