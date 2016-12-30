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

  splitAt(index: number,  a: Line, b: Line) {
    if(index < 0) {
      throw Error();
    }
    
    this.length_ += 2; // add 2 elements
    this.length_--; // remove one element

    // Link the elements
    const elements : Array<any> = [a, b];
    const elementNodes : Array<Node> = elements.map((e: any) => new Node(e));
    for(let i = 1 ; i < elementNodes.length - 1; i++) {
      elementNodes[i].next = elementNodes[i+1];
      elementNodes[i].prev = elementNodes[i-1];
    }
    if(elementNodes.length > 1) {
      elementNodes[0].next = elementNodes[1];
      elementNodes[elementNodes.length-1].prev = elementNodes[elementNodes.length-2];
    }

    if(index == 0) {
      // Empty List or 1 element
      if(this.first == null || this.first.next == null) {
        this.first = elementNodes[0];
        this.last = elementNodes[elementNodes.length-1];
      } else {
        const next = this.first.next
        elementNodes[elementNodes.length-1].next = next;
        this.first = elementNodes[0];
        next.prev = elementNodes[elementNodes.length-1];
      }
      return;
    }

    // index > 1
    let i = 0;
    let curr : Node = this.first;
    while(curr != null) {
      if(i == index) {
        const prev = curr.prev;
        const next = curr.next;

        elementNodes[0].prev = prev;
        elementNodes[elementNodes.length-1].next = next;
      
        // Last
        if(next == null) {
          this.last = elementNodes[elementNodes.length-1];
          prev.next = elementNodes[0];
        } else {
          prev.next = elementNodes[0];        
          next.prev = elementNodes[elementNodes.length-1];
        }
        
        return;
      }
      curr = curr.next;
      i++;
    }
  }
}