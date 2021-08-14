import { Card } from "@material-ui/core";
import React, { Component } from "react";

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: [],
            isDrawing: false,
            isPressing: false
        };
        this.canvasRef = React.createRef();
        this.canvas = null;
        this.canvasCtx = null;
    }

    componentDidMount = () => {
        console.log("This is canvas ref", this.canvasRef.current);
        this.canvas = this.canvasRef.current;
        this.canvasCtx = this.canvas.getContext("2d");
    }

    getPointerPosition = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        }
    }

    drawPoints = (start, end) => {
        const ctx = this.canvasCtx;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 10;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
    }

    handlePointerMove = (x, y) => {
        if (this.state.isPressing && !this.state.isDrawing) {
            this.setState({
                points: [{ x, y }],
                isDrawing: true
            });
        }
        if (this.state.isDrawing) {
            console.log("handlePointerMove", x, y);
            const points = this.state.points;
            points.push({ x, y });
            const len = points.length;
            if (len < 2) return;
            const start = points[len - 2];
            const end = points[len - 1];
            this.drawPoints(start, end);
        }

    }

    handleDrawStart = (e) => {
        e.preventDefault();
        const { x, y } = this.getPointerPosition(e);
        this.setState({
            isPressing: true
        })
        this.handlePointerMove(x, y);
    }

    handleDrawMove = (e) => {
        e.preventDefault();
        const { x, y } = this.getPointerPosition(e);
        this.handlePointerMove(x, y);
    }

    handleDrawEnd = (e) => {
        e.preventDefault();
        this.setState({
            isDrawing: false,
            isPressing: false
        });
    }




    render() {
        return (
            <Card style={{ display: 'inline-block', margin: '0 auto' }} elevation={20}>
                <canvas ref={this.canvasRef} width="1000" height="700" style={{ width: '100%', height: 'auto' }}
                    onMouseDown={this.handleDrawStart}
                    onMouseMove={this.handleDrawMove}
                    onMouseUp={this.handleDrawEnd}
                    onMouseOut={this.handleDrawEnd}
                />
            </Card>
        );
    }
}

export default Canvas;