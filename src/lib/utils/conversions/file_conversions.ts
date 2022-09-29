import _, { reject } from 'lodash';

export async function nodesToJson(buffer: Buffer): Promise<Buffer> {

    let index = 0;
    let version = 0;

	return new Promise((resolve, reject) => {
		let newBuffer = buffer;
		
        let stickfigure: {
            header: {
                version: number,
                scale: number,
                color: number
            },
            nodes: Array<any>,
            polyfills?: Array<any>,
            notes?: Array<string>
        } = {
            header: {
                version: 0,
                scale: 1,
                color: -7750672
            },
            nodes: [],
        }

        version = buffer.readInt32BE(newOffset32())
        if (version < 0 || version > 334) {
            reject('Unsupported .nodes version or invalid file structure.');
            return;
        }
        stickfigure.header.version = version;
        let scale = buffer.readFloatBE(newOffset32());
        stickfigure.header.scale = scale;
        let color = buffer.readInt32BE(newOffset32());
        stickfigure.header.color = color;
        let nodes = readNodes();
        stickfigure.nodes.push(nodes);

        if (version >= 230) {
            stickfigure.polyfills = [];
            let numberOfPolyfills = buffer.readInt32BE(newOffset32());
            for (let i = 0;i < numberOfPolyfills;i++) {
                stickfigure.polyfills.push(readPolyfill());
            }
            if (stickfigure.polyfills.length === 0) delete stickfigure.polyfills;
        }

        if (buffer.length - 1 > index) {
            let numberOfNotes = buffer.readInt8(newOffset8());
            for (let i = 0;i < numberOfNotes;i++) {
                stickfigure.notes = readNotes();
            }
        }

        newBuffer = Buffer.from(JSON.stringify(stickfigure, null, 2));

		resolve(newBuffer);
	});

    function readNodes () : any {
        let nodeType;
        let drawOrder;
        let isStatic;
        let isStretchy;
        let isSmartStretch;
        let doNotApplySmartStretch;
        let useSegmentColor;
        let useCircleOutline;
        let useGradient;
        let reverseGradient;
        let useSegmentScale;
        let localX;
        let localY;
        let scale;
        let defaultLength;
        let length;
        let defaultThickness;
        let thickness;
        let segmentCurveRadius;
        let halfArc;
        let rightTriangleDirection;
        let triangleUpsideDown;
        let trapezoidTopThicknessRatio;
        let numberOfPolygonVertices;
        let defaultLocalAngle;
        let localAngle;
        let defaultAngle;
        let color;
        let gradientColor;
        let circleOutlineColor;
        let numberOfChildNodes;
        const nodes = [];
    
        nodeType = buffer.readInt8(newOffset8());
        drawOrder = buffer.readInt32BE(newOffset32());
        isStatic = buffer.readInt8(newOffset8());
        isStretchy = buffer.readInt8(newOffset8());
        if (version >= 248) isSmartStretch = buffer.readInt8(newOffset8());
        if (version >= 252) doNotApplySmartStretch = buffer.readInt8(newOffset8());
        useSegmentColor = buffer.readInt8(newOffset8());
        if (version >= 256) useCircleOutline = buffer.readInt8(newOffset8());
        if (version >= 176) useGradient = buffer.readInt8(newOffset8());
        if (version >= 176) reverseGradient = buffer.readInt8(newOffset8());
        useSegmentScale = buffer.readInt8(newOffset8());
        localX = buffer.readFloatBE(newOffset32());
        localY = buffer.readFloatBE(newOffset32());
        scale = buffer.readFloatBE(newOffset32());
        defaultLength = buffer.readFloatBE(newOffset32());
        length = buffer.readFloatBE(newOffset32());
        defaultThickness = buffer.readInt32BE(newOffset32());
        thickness = buffer.readInt32BE(newOffset32());
        if (version >= 320) segmentCurveRadius = buffer.readInt32BE(newOffset32());
        if (version >= 256) halfArc = buffer.readInt8(newOffset8());
        if (version >= 256) rightTriangleDirection = buffer.readInt16BE(newOffset16());
        if (version >= 300) triangleUpsideDown = buffer.readInt8(newOffset8());
        if (version >= 256) trapezoidTopThicknessRatio = buffer.readFloatBE(newOffset32());
        if (version >= 256) numberOfPolygonVertices = buffer.readInt16BE(newOffset16());
        if (version >= 248) defaultLocalAngle = buffer.readFloatBE(newOffset32());
        localAngle = buffer.readFloatBE(newOffset32());
        if (version >= 248) defaultAngle = buffer.readFloatBE(newOffset32());
        color = buffer.readInt32BE(newOffset32());
        if (version >= 176) gradientColor = buffer.readInt32BE(newOffset32());
        if (version >= 256) circleOutlineColor = buffer.readInt32BE(newOffset32());
        numberOfChildNodes = buffer.readInt32BE(newOffset32());
    
        for(let i=0;i<numberOfChildNodes;i++) {
            nodes.push(readNodes());
        }
    
        return {
            nodeType: nodeType,
            drawOrder: drawOrder,
            isStatic: isStatic,
            isStretchy: isStretchy,
            isSmartStretch: isSmartStretch,
            doNotApplySmartStretch: doNotApplySmartStretch,
            useSegmentColor: useSegmentColor,
            useCircleOutline: useCircleOutline,
            useGradient: useGradient,
            reverseGradient: reverseGradient,
            useSegmentScale: useSegmentScale,
            localX: localX,
            localY: localY,
            scale: scale,
            defaultLength: defaultLength,
            length: length,
            defaultThickness: defaultThickness,
            thickness: thickness,
            segmentCurveRadius: segmentCurveRadius,
            halfArc: halfArc,
            rightTriangleDirection: rightTriangleDirection,
            triangleUpsideDown: triangleUpsideDown,
            trapezoidTopThicknessRatio: trapezoidTopThicknessRatio,
            numberOfPolygonVertices: numberOfPolygonVertices,
            defaultLocalAngle: defaultLocalAngle,
            localAngle: localAngle,
            defaultAngle: defaultAngle,
            color: color,
            gradientColor: gradientColor,
            circleOutlineColor: circleOutlineColor,
            //numberOfChildNodes: numberOfChildNodes,
            nodes: nodes
        }
    }

    function readPolyfill() {
        let drawOrderOfParentNode;
        let color;
        let usePolyfillColor;
        let numberOfPolyfillNodes;
        const polyfillNodes = [];

        drawOrderOfParentNode = buffer.readInt32BE(newOffset32());
        color = buffer.readInt32BE(newOffset32());
        usePolyfillColor = buffer.readInt8(newOffset8());
        numberOfPolyfillNodes = buffer.readInt32BE(newOffset32());
        for(let i = 0;i < numberOfPolyfillNodes;i++) {
            polyfillNodes.push(buffer.readInt32BE(newOffset32()));
        }

        return {
            drawOrderOfParentNode,
            color,
            usePolyfillColor,
            //numberOfPolyfillNodes,
            polyfillNodes
        }
    }

    function readNotes() {
        let contentArray = buffer.subarray(index, buffer.length);
        let content = contentArray.toString('utf8');
        
        
        return content.split(';');
    }

    function newOffset8 () {
        let result = index;
        index += 1;
        return result;
    }
    function newOffset16 () {
        let result = index;
        index += 2;
        return result;
    }
    function newOffset32 () {
        let result = index;
        index += 4;
        return result;
    }
}

export function jsonToNodes(buffer: Buffer): Promise<Buffer> {

    let stickfigureBuffer : Buffer[] = [];
    let indexRoot = 0;
    let version = 0;

    return new Promise((resolve, _reject) => {
        let newBuffer = buffer;
        let stickfigure: {
            header: {
                version: number,
                scale: number,
                color: number
            },
            nodes: Array<any>,
            polyfills?: Array<any>,
            notes?: Array<string>
        } = {
            header: {
                version: -987654,
                scale: 1,
                color: -7750672
            },
            nodes: [],
        }

        try {
            stickfigure = JSON.parse(buffer.toString());
        } catch(err) {
            reject("There was an error with parsing the JSON.")
            return;
        }
        if (stickfigure.header.version < 0) {
            reject('Valid JSON, but invalid stickfigure JSON version.')
            return;
        }

        version = stickfigure.header.version;

        let header = Buffer.alloc(12);
        header.writeInt32BE(stickfigure.header.version, newOffset32Root());
        header.writeFloatBE(stickfigure.header.scale, newOffset32Root());
        header.writeInt32BE(stickfigure.header.color, newOffset32Root());
        stickfigureBuffer.push(header);
        
        for (let i = 0;i < stickfigure.nodes.length;i++) {
            writeNode(stickfigure.nodes[i]);
        }

        if (stickfigure.polyfills !== undefined) {
            let polyfillCountBuffer = Buffer.alloc(4);
            polyfillCountBuffer.writeInt32BE(stickfigure.polyfills.length, 0);
            stickfigureBuffer.push(polyfillCountBuffer);
            for (let i = 0;i < stickfigure.polyfills.length;i++) {
                writePolyfill(stickfigure.polyfills[i]);
            }
        } else {
            let polyfillCountBuffer = Buffer.alloc(4);
            polyfillCountBuffer.writeInt32BE(0, 0);
            stickfigureBuffer.push(polyfillCountBuffer);
        }

        if (stickfigure.notes !== undefined) {
            writeNotes(stickfigure.notes);
        }

        newBuffer = Buffer.concat(stickfigureBuffer);

        resolve(newBuffer);
    });

    function writeNode(node: any) {
        let bufferSize = 0;
        bufferSize += 49;
        if (version >= 248) bufferSize += 1;
        if (version >= 252) bufferSize += 1;
        if (version >= 256) bufferSize += 1;
        if (version >= 176) bufferSize += 1;
        if (version >= 176) bufferSize += 1;
        if (version >= 320) bufferSize += 4;
        if (version >= 256) bufferSize += 1;
        if (version >= 256) bufferSize += 2;
        if (version >= 300) bufferSize += 1;
        if (version >= 256) bufferSize += 4;
        if (version >= 256) bufferSize += 2;
        if (version >= 248) bufferSize += 4;
        if (version >= 248) bufferSize += 4;
        if (version >= 176) bufferSize += 4;
        if (version >= 256) bufferSize += 4;

        let nodeBuffer = Buffer.alloc(bufferSize);
        let index = 0;

        nodeBuffer.writeInt8(node.nodeType, newOffset8());
        nodeBuffer.writeInt32BE(node.drawOrder, newOffset32());
        nodeBuffer.writeInt8(node.isStatic, newOffset8());     /// 7
        nodeBuffer.writeInt8(node.isStretchy, newOffset8());
        if (version >= 248) nodeBuffer.writeInt8(node.isSmartStretch, newOffset8());
        if (version >= 252) nodeBuffer.writeInt8(node.doNotApplySmartStretch, newOffset8());
        nodeBuffer.writeInt8(node.useSegmentColor, newOffset8());  /// 1
        if (version >= 256) nodeBuffer.writeInt8(node.useCircleOutline, newOffset8());
        if (version >= 176) nodeBuffer.writeInt8(node.useGradient, newOffset8());
        if (version >= 176) nodeBuffer.writeInt8(node.reverseGradient, newOffset8());
        nodeBuffer.writeInt8(node.useSegmentScale, newOffset8());
        nodeBuffer.writeFloatBE(node.localX, newOffset32());
        nodeBuffer.writeFloatBE(node.localY, newOffset32());
        nodeBuffer.writeFloatBE(node.scale, newOffset32());   /// 29
        nodeBuffer.writeFloatBE(node.defaultLength, newOffset32());
        nodeBuffer.writeFloatBE(node.length, newOffset32());
        nodeBuffer.writeInt32BE(node.defaultThickness, newOffset32());
        nodeBuffer.writeInt32BE(node.thickness, newOffset32());
        if (version >= 320) nodeBuffer.writeInt32BE(node.segmentCurveRadius, newOffset32());
        if (version >= 256) nodeBuffer.writeInt8(node.halfArc, newOffset8());
        if (version >= 256) nodeBuffer.writeInt16BE(node.rightTriangleDirection, newOffset16());
        if (version >= 300) nodeBuffer.writeInt8(node.triangleUpsideDown, newOffset8());
        if (version >= 256) nodeBuffer.writeFloatBE(node.trapezoidTopThicknessRatio, newOffset32());
        if (version >= 256) nodeBuffer.writeInt16BE(node.numberOfPolygonVertices, newOffset16());
        if (version >= 248) nodeBuffer.writeFloatBE(node.defaultLocalAngle, newOffset32());
        nodeBuffer.writeFloatBE(node.localAngle, newOffset32()); /// 4
        if (version >= 248) nodeBuffer.writeFloatBE(node.defaultAngle, newOffset32());
        nodeBuffer.writeInt32BE(node.color, newOffset32()); /// 4
        if (version >= 176) nodeBuffer.writeInt32BE(node.gradientColor, newOffset32());
        if (version >= 256) nodeBuffer.writeInt32BE(node.circleOutlineColor, newOffset32());
        nodeBuffer.writeInt32BE(node.nodes.length, newOffset32()); /// 4

        stickfigureBuffer.push(nodeBuffer);

        for (let i = 0;i < node.nodes.length;i++) {
            writeNode(node.nodes[i]);
        }

        function newOffset8 () {
            let result = index;
            index += 1;
            return result;
        }
        function newOffset16 () {
            let result = index;
            index += 2;
            return result;
        }
        function newOffset32 () {
            let result = index;
            index += 4;
            return result;
        }
    }

    function writePolyfill(polyfill: any) {
        let index = 0;
        let polyfillHeaderBuffer = Buffer.alloc(13);
        polyfillHeaderBuffer.writeInt32BE(polyfill.drawOrderOfParentNode, newOffset32());
        polyfillHeaderBuffer.writeInt32BE(polyfill.color, newOffset32());
        polyfillHeaderBuffer.writeInt8(polyfill.usePolyfillColor, newOffset8());
        polyfillHeaderBuffer.writeInt32BE(polyfill.polyfillNodes.length, newOffset32());

        let indexN = 0;
        let polyfillNodesBuffer = Buffer.alloc(polyfill.polyfillNodes.length);
        for (let i = 0;i < polyfill.polyfillNodes.length;i++) {
            polyfillNodesBuffer.writeInt32BE(polyfill.polyfillNodes[i], newOffset32N());
        }

        let fullPolyfillBuffer = Buffer.concat([polyfillHeaderBuffer, polyfillNodesBuffer]);
        stickfigureBuffer.push(fullPolyfillBuffer);

        function newOffset8 () {
            let result = index;
            index += 1;
            return result;
        }
        function newOffset32 () {
            let result = index;
            index += 4;
            return result;
        }
        function newOffset32N () {
            let result = indexN;
            indexN += 4;
            return result;
        }
    }

    function writeNotes(notes: string[]) {
        let noteString = '';
        for (let i = 0;i < notes.length;i++) {
            if (i != notes.length - 1)  {
                noteString += notes[i] + ';';
            } else {
                noteString += notes[i];
            }
        }

        let noteBuffer = Buffer.from(noteString);
        stickfigureBuffer.push(noteBuffer);
    }

    function newOffset32Root () {
        let result = indexRoot;
        indexRoot += 4;
        return result;
    }
}