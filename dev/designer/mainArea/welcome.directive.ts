///<reference path="../../../typings/index.d.ts" />
import { Directive, OnInit, EventEmitter, ElementRef, Renderer } from '@angular/core';
import * as d3 from 'd3';
@Directive({
    selector: '[sys-welcome]',
    inputs: ['width : width', 'height :height'],
    outputs: ['welcomNodeClicked'],
    host: {
        '(click)': 'handleEvent( $event )',
    }
})

export class WelcomeGraph implements OnInit {
    width: string;
    height: string;
    canvas: any;
    data: any;
    tree: any;
    toolTip_Div: any;
    welcomNodeClicked = new EventEmitter<Object>();
    xpadding: number = 100;
    hpadding: number = 80;
    l: number;
    h: number;
    constructor(private elRef: ElementRef, private render: Renderer) {
    }
    ngOnInit(): any {
        var el: any = this.elRef.nativeElement;
        var graph: any = d3.select(el);
        var w = +this.width - 100;
        this.h = +this.height - 20;;

        this.l = w - 2 * this.xpadding;
        //Original data
        var dataset = {
            nodes: [

                { name: 'Start', class: 'svgNode', x_v: this.xpadding, y_v: this.hpadding, img: 'public/img/start-icon_company_green.png', type: 'Start' },
                { name: 'Define Package Profile', class: 'svgNode', x_v: this.xpadding + this.l / 12, y_v: this.h / 3, img: 'public/img/unisecure_icon_packageprofile.svg', type: 'PackageProfile' },
                { name: 'Define Product', class: 'svgNode', x_v: this.xpadding + this.l / 3, y_v: this.h / 2, img: 'public/img/unisecure_icon_product.svg', type: 'Product' },
                { name: 'Define Family', class: 'svgNode', x_v: this.xpadding + 2 * this.l / 3, y_v: this.h / 2, img: 'public/img/unisecure_icon_family.svg', type: 'Family' },
                { name: 'Define Item Run', class: 'svgDNode', x_v: this.xpadding + 11 * this.l / 12, y_v: this.h / 3, img: 'public/img/unisecure_icon_itemrun.svg', type: 'ItemRun' },
                { name: 'Define Calendar Policy', class: 'svgDNode', x_v: this.xpadding + this.l / 6, y_v: 8 * this.h / 11, img: 'public/img/unisecure_icon_calendar.svg', type: 'Calender' },
                { name: 'Define Life Cycle', class: 'svgDNode', x_v: this.xpadding + 11 * this.l / 12, y_v: 8 * this.h / 11, img: 'public/img/unisecure_icon_cycle_sketch01b_2.svg', type: 'LifeCycle' },
                { name: 'Publish', class: 'svgNode', x_v: w - this.xpadding, y_v: this.hpadding, img: 'public/img/publish_company_green.png', type: 'Publish' }
            ],
            edges: [
                { source: 0, target: 1, require: true, sweep: 1 },
                { source: 1, target: 2, require: true, sweep: 1 },
                { source: 2, target: 3, require: true, sweep: 0 },
                { source: 3, target: 4, require: true, sweep: 1 },
                { source: 4, target: 7, require: true, sweep: 1 },
                { source: 5, target: 2, require: false, sweep: 1 },
                { source: 6, target: 4, require: false, sweep: 0 },
            ]
        };
        this.canvas = graph.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g')
            .attr('transform', 'translate(20, 10)');
        this.renderData(dataset);
    }
    renderData(dataset) {
        //Easy colors
        this.canvas.append('defs').selectAll('marker')
            .data(['arrowHigh_blue', 'arrowLow_blue', 'arrowHigh_orange', 'arrowLow_orange'])
            .enter().append('marker')
            .attr('id', function (d) { return d; })
            .attr('refX', 16.5)
            .attr('refY', function (d) { return (d === 'arrowHigh_blue' || d === 'arrowHigh_orange') ? 0.5 : 3.2 })
            .attr('markerUnits', 'strokeWidth')
            .attr('markerWidth', 6)
            .attr('markerHeight', 8)
            .attr('orient', 'auto')
            .append('path')
            .attr('fill', function (d) { return (d === 'arrowHigh_blue' || d === 'arrowLow_blue') ? '#3b73b9' : 'orange' })
            .attr('stroke', function (d) { return (d === 'arrowHigh_blue' || d === 'arrowLow_blue') ? '#3366CE' : 'orange' })
            .attr('d', 'M 0,0 V 4 L6,2 Z');
        //Initialize a default force layout, using the nodes and edges in dataset
        var force = d3.layout.force()
            .charge(-400)
            .linkDistance(300)
            .nodes(dataset.nodes)
            .links(dataset.edges)
            .size([+this.width, + this.height]);
        //Create edges as lines
        var edges = this.canvas.selectAll('.link');
        edges = edges.data(force.links());
        edges.enter()
            .append('path')
            .attr('stroke-width', 4)
            .attr('class', 'welcomeLink')
            .attr('stroke', function (d) {
                console.log(d.source);
                if (d.require) {
                    return '#3b73b9';
                }
                return 'orange';
            })
            .attr('marker-end', function (l) {
                if (l.sweep === 1) {
                    return l.require ? 'url(#arrowHigh_blue)' : 'url(#arrowHigh_orange)';
                }
                return l.require ? 'url(#arrowLow_blue)' : 'url(#arrowLow_orange)';
            });
        edges.exit().remove();
        //Create nodes as circles
        var circles = this.canvas.selectAll('.node');
        circles = circles.data(force.nodes());
        circles.enter()
            .append('g').call(force.drag);
        //append img
        circles.append('svg:image')
            .attr('width', 48)
            .attr('height', 48)
            .attr('class', function (d) {
                return d.class;
            })
            .attr('xlink:href', function (d) {
                return d.img;
            });
        //Add easy text label
        circles.append('text')
            .text(function (d) {
                if (d.name === 'Start' || d.name === 'End') {
                    return '';
                }
                return d.name;
            }).attr('x', 0)
            .attr('y', 60)
            .attr('font-size', 14);
        //Every time the simulation 'ticks', this will be called
        force.on('tick', function () {
            circles.attr('transform', function (d) {
                return 'translate(' + (d.x_v - 24) + ',' + (d.y_v - 28) + ')';
            });
            edges.attr('d', function (d) {
                var dx = d.target.x_v - d.source.x_v;
                var dy = d.target.y_v - d.source.y_v;
                var dr = Math.sqrt(dx * dx + dy * dy);
                return 'M' + d.source.x_v + ',' + d.source.y_v + 'A' + dr + ',' + dr + ' 0 0,' + d.sweep + d.target.x_v + ',' + d.target.y_v;
            });
        });
        circles.exit().remove();
        force.start();
    }
    handleEvent(globalEvent) {
        var data = globalEvent.target.__data__;
        if (data !== null) {
            this.welcomNodeClicked.emit({ 'type': globalEvent.target.__data__.type });
        }
    }
}
