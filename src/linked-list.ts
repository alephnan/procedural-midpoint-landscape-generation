/**
 * Doubly Linked List Data structure
 */
import {Line} from './line';
import {Pair} from './pair';

export class Node {
  public data: any;
  public prev: Node;
  public next: Node;

  constructor(data: any) {
    this.prev = null;
    this.next = null;
    this.data = data;
  }
}

export class LinkedList {
  private first: Node;
  private last: Node;
  private length_: number;

  constructor() {
    this.first = null;
    this.last = null;
    this.length_ = 0;
  }

  length() : number {
    return this.length_;
  }

  get(index: number) : any {
    return this.getNode(index).data;
  }

  // TODO(automatwon): Loop backward from end if closer to index.
  private getNode(index: number) : Node {
    let i = 0;
    let curr : Node = this.first;
    while(curr != null) {
      if(i == index) {
        break;
      }
      curr = curr.next;
      i++;
    }

    if(i != index) {
      throw Error('Invalid index');
    }
    return curr;
  }

  push(e: any) {
    const n = new Node(e);
    if(this.last == null) {
      this.first = n;
      this.last = n;
    } else {
      this.last.next = n;
      n.prev = this.last;
      this.last = n;
    }

    this.length_++;
  }

  forEach(f: Function) : void {
    let i = 0;
    let curr : Node = this.first;
    while(curr != null) {
      f(curr.data);
      curr = curr.next;
      i++;
    }
  }

  splitAt(index: number,  split: Pair<Line>) {
    // TODO(automatwon): Disable these defensive checks for performance
    if(index < 0) {
      throw Error();
    }
    if(this.first == null) {
      throw Error('Invalid index');
    }
    if(this.first.next == null && index != 0) {
      throw Error('Index DNE');
    }
    if(index >= this.length()) {
      throw Error('Index out bounds');
    }
    
    // Replace one element with two
    this.length_++;

    // Link the elements
    const leftNode = new Node(split.x);
    const rightNode = new Node(split.y);
    leftNode.next = rightNode;
    rightNode.prev = leftNode;

    if(this.first.next == null) { // 1 element
      this.first = leftNode;
      this.last = rightNode;
    } else if(index == 0) { // First Element
      const next = this.first.next
      rightNode.next = next;
      this.first = leftNode;
      next.prev = rightNode;
    } else if(index == this.length() - 2) { // last element 
      this.last.prev.next = leftNode;
      this.last = rightNode;
    } else { // middle case
      let curr : Node = this.getNode(index);

      const prev = curr.prev;
      const next = curr.next;
      leftNode.prev = prev;
      rightNode.next = next;

      prev.next = leftNode;        
      next.prev = rightNode;
    }
  }
}