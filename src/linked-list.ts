/**
 * Doubly Linked List Data structure
 */
import {Line} from './line';

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
    let i = 0;
    let curr : Node = this.first;
    while(curr != null) {
      if(i == index) {
        return curr.data;
      }
      curr = curr.next;
      i++;
    }
    return null;
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

  splitAt(index: number,  left: Line, right: Line) {
    if(index < 0) {
      throw Error();
    }
    
    // Replace one element with two
    this.length_++;

    // Link the elements
    const leftNode = new Node(left);
    const rightNode = new Node(right);
    leftNode.next = rightNode;
    rightNode.prev = leftNode;

    if(index == 0) {
      // Empty List or 1 element
      if(this.first == null || this.first.next == null) {
        this.first = leftNode;
        this.last = rightNode;
      } else {
        const next = this.first.next
        rightNode.next = next;
        this.first = leftNode;
        next.prev = rightNode;
      }
      return;
    }

    // Find the element to replace
    let i = 0;
    let curr : Node = this.first;
    while(curr != null) {
      if(i == index) {
        break;
      }
      curr = curr.next;
      i++;
    }

    const prev = curr.prev;
    const next = curr.next;
    leftNode.prev = prev;
    rightNode.next = next;
  
    // Last
    if(next == null) {
      this.last = rightNode;
      prev.next = leftNode;
    } else {
      prev.next = leftNode;        
      next.prev = rightNode;
    }
  }
}