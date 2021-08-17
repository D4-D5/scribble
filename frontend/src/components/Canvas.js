import React, { Component } from "react";
import { Button, ButtonGroup, Card } from '@material-ui/core';
import { CirclePicker } from 'react-color';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import BrushIcon from '@material-ui/icons/Brush';
import { ReactComponent as EraserIcon } from '../assets/images/eraser_icon.svg'
import { MODES } from '../common/Constants';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            points: [],
            isPressing: false,
            isDrawing: false,
            selectedColor: '#000000',
            brushSize: 10,
            selectedMode: MODES.PEN
        }
        this.canvasRef = React.createRef();
        this.canvasCtx = null;
        this.canvas = null;
    }

    handleWindowMouseUp = () => {
        this.setState({
            isPressing: false,
            isDrawing: false
        })
    }

    componentDidMount = () => {
        window.addEventListener("mouseup", this.handleWindowMouseUp)
        console.log("Canvas Ref", this.canvasRef);
        this.canvas = this.canvasRef.current;
        this.canvasCtx = this.canvas.getContext('2d');
    }

    getPosition = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // first normalize the mouse coordinates from 0 to 1 (0,0) top left
        // off canvas and (1,1) bottom right by dividing by the bounds width and height
        x /= rect.width;
        y /= rect.height;

        // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution

        x *= this.canvas.width;
        y *= this.canvas.height;

        return { x, y };
    }

    drawPoints = (start, end) => {
        const ctx = this.canvasCtx
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = this.state.selectedMode === MODES.ERASER ? 'white' : this.state.selectedColor;
        ctx.lineWidth = this.state.brushSize;
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
        this.setState({
            isPressing: true
        });
        const { x, y } = this.getPosition(e);
        console.log("handleDrawStart ", x, y);
        this.handlePointerMove(x, y);
    }

    handleDrawMove = (e) => {
        e.preventDefault();
        const { x, y } = this.getPosition(e);
        this.handlePointerMove(x, y);
    }

    handleDrawEnd = (e) => {
        e.preventDefault();
        this.setState({
            isPressing: false,
            isDrawing: false,
            points: []
        })
    }

    handleDrawOut = (e) => {
        e.preventDefault();
        this.setState({
            points: []
        })
    }

    updateSelectedColor = (color) => {
        this.setState({
            selectedColor: color
        });
    }

    updateBrushSize = (size) => {
        this.setState({
            brushSize: size
        });
    }

    clearScreen = () => {
        this.canvasCtx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    updateSeletedMode = (val) => {
        this.setState({
            selectedMode: val
        })
    }

    render() {
        const { selectedColor } = this.state;
        return (
            <Card style={{ display: 'inline-block' }} elevation={10}>
                <canvas ref={this.canvasRef} style={{ width: '100%', height: 'auto' }} width="1000" height="650"
                    onMouseDown={this.handleDrawStart}
                    onMouseMove={this.handleDrawMove}
                    onMouseUp={this.handleDrawEnd}
                    onMouseOut={this.handleDrawOut}
                />
                <div style={{ padding: '8px', backgroundColor: '#edecea', display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <div style={{ display: 'flex', alignItems: 'center ' }}>
                        <div style={{ backgroundColor: selectedColor, marginRight: '18px', width: '36px', height: '36px', boxShadow: '1px 1px 5px' }} />
                        <CirclePicker
                            width="100%"
                            colors={["#000000", "#ffffff", '#FF6900', '#FCB900', '#7BDCB5', '#00D084', '#8ED1FC', '#0693E3', '#EB144C', '#F78DA7', '#9900EF']}
                            onChange={(e) => this.updateSelectedColor(e.hex)} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center ', marginLeft: '14px' }}>
                        <IconButton
                            style={{ marginRight: '14px', backgroundColor: 'white' }}
                            color='inherit'
                            onClick={() => this.updateSeletedMode(MODES.PEN)}
                            children={
                                <BrushIcon />
                            }
                        />
                        <IconButton
                            style={{ marginRight: '14px', backgroundColor: 'white' }}
                            onClick={() => this.updateSeletedMode(MODES.ERASER)}
                            children={
                                <EraserIcon />
                            }
                        />
                    </div>

                    <ButtonGroup variant="contained" disableElevation aria-label="contained primary button group" >
                        <Button style={{ backgroundColor: 'white' }} onClick={() => this.updateBrushSize(10)}>
                            < div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'black' }} />
                        </Button>
                        <Button style={{ backgroundColor: 'white' }} onClick={() => this.updateBrushSize(20)}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'black' }} />
                        </Button>
                        <Button style={{ backgroundColor: 'white' }} onClick={() => this.updateBrushSize(30)}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'black' }} />
                        </Button>
                        <Button style={{ backgroundColor: 'white' }} onClick={() => this.updateBrushSize(40)}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'black' }} />
                        </Button>
                    </ButtonGroup>

                    {/* <div style={{ display: 'flex', alignItems: 'center ' }}>
                        <IconButton
                            style={{ marginRight: '14px', backgroundColor: 'white' }}
                            onClick={() => this.updateBrushSize(10)}
                            children={
                                < div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'black' }} />
                            }
                        />
                        <IconButton
                            style={{ marginRight: '14px', backgroundColor: 'white' }}
                            onClick={() => this.updateBrushSize(20)}
                            children={
                                <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'black' }} />
                            }
                        />
                        <IconButton
                            style={{ marginRight: '14px', backgroundColor: 'white' }}
                            onClick={() => this.updateBrushSize(40)}
                            children={
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'black' }} />
                            }
                        />
                        <IconButton
                            style={{ marginRight: '14px', backgroundColor: 'white' }}
                            onClick={() => this.updateBrushSize(60)}
                            children={
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'black' }} />
                            }
                        />
                    </div> */}

                    <IconButton
                        style={{ backgroundColor: 'white' }}
                        color='inherit'
                        onClick={() => this.clearScreen()}
                        children={
                            <DeleteIcon />
                        }
                    />

                </div>

            </Card>
        );
    }
}

export default Canvas;