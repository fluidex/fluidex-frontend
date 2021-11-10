import EventEmitter from "eventemitter3";

class Message extends EventEmitter {
  constructor() {
    super();
    this.task = [];
    const fn = () => this.next();
    this.task.push(fn);
    setTimeout(() => this.next(), 0);
  }

  delay(ms = 1000) {
    const fn = () => setTimeout(() => this.next(), ms);
    this.task.push(fn);
    return this;
  }

  send(action, data) {
    const fn = () => {
      this.emit(action, data);
      this.next();
    };
    this.task.push(fn);
    return this;
  }

  next() {
    const fn = this.task.shift();
    fn && fn();
  }
}

export default Message;
