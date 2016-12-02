import {Directive, OnInit, EventEmitter, ElementRef, Renderer} from '@angular/core';


@Directive({
    selector: '[sys-nav-bar]',
    outputs: ['enterNavigator'],
    host: {
        '(mouseenter)': 'onMouseEnter()',
        '(mouseleave)': 'onMouseLeave()'
    }

})

export class NavigatorDirective {
    enterNavigator = new EventEmitter<Object>();

    onMouseEnter() {
        this.enterNavigator.emit({ 'enter': true });
    }

    onMouseLeave() {
        this.enterNavigator.emit({ 'enter': false });
    }
}
