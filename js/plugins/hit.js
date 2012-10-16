(function () {

    var
    D = Flotr.DOM,
        _ = Flotr._,
        flotr = Flotr,
        //This is the bounding box which sits around the data points.
        S_MOUSETRACK = 'display:none;position:absolute;white-space:nowrap;';

    Flotr.addPlugin('hit', {
        callbacks: {
            'flotr:mousemove': function (e, pos) {
                this.hit.track(pos);
            },
            'flotr:click': function (pos) {
                this.hit.track(pos);
            },
            'flotr:mouseout': function () {
                this.hit.clearHit();
            }
        },
        track: function (pos) {
            if (this.options.mouse.track || _.any(this.series, function (s) {
                return s.mouse && s.mouse.track;
            })) {
                this.hit.hit(pos);
            }
        },
        /**
         * Try a method on a graph type.  If the method exists, execute it.
         * @param {Object} series
         * @param {String} method  Method name.
         * @param {Array} args  Arguments applied to method.
         * @return executed successfully or failed.
         */
        executeOnType: function (s, method, args) {
            var
            success = false,
                options;

            if (!_.isArray(s)) s = [s];

            function e(s, index) {
                _.each(_.keys(flotr.graphTypes), function (type) {
                    if (s[type] && s[type].show && this[type][method]) {
                        options = this.getOptions(s, type);

                        options.fill = !! s.mouse.fillColor;
                        options.fillStyle = this.processColor(s.mouse.fillColor || '#ffffff', {
                            opacity: s.mouse.fillOpacity
                        });
                        options.color = s.mouse.lineColor;
                        options.context = this.octx;
                        options.index = index;

                        if (args) options.args = args;
                        this[type][method].call(this[type], options);
                        success = true;
                    }
                }, this);
            }
            _.each(s, e, this);

            return success;
        },



        drawMultipleHit: function (n) {
            var i;
            for (i = 0; i < n.dataSets.length; i++) {
                var tempDataSet =  this.hit.formatMultipleToSingle(n, n.dataSets[i]);
                this.hit.drawHit(tempDataSet);
            }
            this.prevHit = n;
        },

        /**
         * Updates the mouse tracking point on the overlay.
         */
        drawHit: function (n) {
            var octx = this.octx,
                s = n.series;

            if (s.mouse.lineColor) {
                
                octx.save();
                octx.lineWidth = (s.points ? s.points.lineWidth : 1);
                octx.strokeStyle = s.color; //s.mouse.lineColor;
                octx.fillStyle = this.processColor(s.mouse.fillColor || '#ffffff', {
                    opacity: s.mouse.fillOpacity
                });
                octx.translate(this.plotOffset.left, this.plotOffset.top);
                
                if (!this.hit.executeOnType(s, 'drawHit', n)) {
                    var xa = n.xaxis,
                        ya = n.yaxis;

                    octx.beginPath();
                    // TODO fix this (points) should move to general testable graph mixin
                    octx.arc(xa.d2p(n.x), ya.d2p(n.y), s.points.radius || s.mouse.radius, 0, 2 * Math.PI, true);
                    octx.fill();
                    octx.stroke();
                    octx.closePath();
                }
                octx.restore();
                this.clip(octx);
            } else {
                console.log('error');
            }
            this.prevHit = n;
        },


        clearHits: function () {
            var prev = this.prevHit,
                i;

            if (prev) {
                if (prev.multipleItems) {
                    for (i = 0; i < prev.dataSets.length; i++) {
                        var tempDataSet =  this.hit.formatMultipleToSingle(prev, prev.dataSets[i]);
                        this.hit.clearHit(tempDataSet);
                    }
                } else {
                    this.hit.clearHit(prev);
                }
                //@TODO: 
                //After fixing Draw Moust Track re-add this in
                D.hide(this.mouseTrack);
                this.prevHit = null;
            }
        },

        /**
         * Removes the mouse tracking point from the overlay.
         */
        clearHit: function (itemToClear) {
            var prev = itemToClear,
                octx = this.octx,
                i, plotOffset = this.plotOffset;
            octx.save();
            octx.translate(plotOffset.left, plotOffset.top);
            if (prev) {
                if (!this.hit.executeOnType(prev.series, 'clearHit', prev)) {
                    // TODO fix this (points) should move to general testable graph mixin
                    var
                    s = prev.series,
                        lw = (s.points ? s.points.lineWidth : 1);
                    offset = (s.points.radius || s.mouse.radius) + lw;
                    octx.clearRect(
                    prev.xaxis.d2p(prev.x) - offset, prev.yaxis.d2p(prev.y) - offset, offset * 2, offset * 2);

                }
                //		moved to parent function.
                //      D.hide(this.mouseTrack);
                //      this.prevHit = null;
            }
            octx.restore();
        },
        /**
         * Retrieves the nearest data point from the mouse cursor. If it's within
         * a certain range, draw a point on the overlay canvas and display the x and y
         * value of the data.
         * @param {Object} mouse - Object that holds the relative x and y coordinates of the cursor.
         */
        hit: function (mouse) {

            var
            options = this.options,
                prevHit = this.prevHit,
                closest, sensibility, dataIndex, seriesIndex, series, value, xaxis, yaxis, i;

            if (this.series.length === 0) return;

            // Nearest data element.
            // dist, x, y, relX, relY, absX, absY, sAngle, eAngle, fraction, mouse,
            // xaxis, yaxis, series, index, seriesIndex
            n = {
                relX: mouse.relX,
                relY: mouse.relY,
                absX: mouse.absX,
                absY: mouse.absY
            };

            if (options.mouse.trackY && !options.mouse.trackAll && this.hit.executeOnType(this.series, 'hit', [mouse, n])) {

                if (!_.isUndefined(n.seriesIndex)) {
                    series = this.series[n.seriesIndex];
                    n.series = series;
                    n.mouse = series.mouse;
                    n.xaxis = series.xaxis;
                    n.yaxis = series.yaxis;
                }
            } else {

                closest = this.hit.closest(mouse);

                if (closest) {

                    closest = options.mouse.trackY ? closest.point : closest.x;
                    seriesIndex = closest.seriesIndex;
                    series = this.series[seriesIndex];
                    xaxis = series.xaxis;
                    yaxis = series.yaxis;
                    sensibility = 2 * series.mouse.sensibility;


                    if (options.mouse.trackAll || (closest.distanceX < sensibility / xaxis.scale && (!options.mouse.trackY || closest.distanceY < sensibility / yaxis.scale))) {

                        n.seriesIndex = seriesIndex;
                        n.index = closest.dataIndex;
                        n.dist = closest.distance;
                        n.mouse = series.mouse;
                        n.multipleItems = false;

                        if (options.mouse.trackAllPoints) {
                            //@TODO Update with the rest
                            n.multipleItems = true;
                            n.dataSets = this.hit.formatMultipleSeries(closest.dataIndex);
                        } else {
                            n.series = series;
                            n.xaxis = series.xaxis;
                            n.yaxis = series.yaxis;
                            n.x = closest.x;
                            n.y = closest.y;
                        }
                    }
                }
            }

            if (!prevHit || (prevHit.index !== n.index || prevHit.seriesIndex !== n.seriesIndex)) {
                this.hit.clearHits();
                if (n.series && n.mouse && n.mouse.track) {
                    this.hit.drawMouseTrack(n);
                    this.hit.drawHit(n);
                    Flotr.EventAdapter.fire(this.el, 'flotr:hit', [n, this]);
                } else if (n.multipleItems && n.mouse && n.mouse.track) {
                    this.hit.drawMouseTrack(n);
                    this.hit.drawMultipleHit(n);
                    Flotr.EventAdapter.fire(this.el, 'flotr:hit', [n, this]);
                } else {
                    console.log('error');
                    console.log(n);
                }
            }
        },


        formatMultipleSeries: function (closestIndex) {
            var i, dataSet = [];

            for (i = 0; i < this.series.length; i++) {
                var tempItem = {};
                var workingSet = this.series[i];
                tempItem.x = workingSet.data[closestIndex][0];
                tempItem.y = workingSet.data[closestIndex][1];
                tempItem.color = workingSet.color;
                tempItem.xaxis = workingSet.xaxis;
                tempItem.yaxis = workingSet.yaxis;
                //		  tempItem.dist        = closest.distance;
                tempItem.index = closestIndex;
                tempItem.seriesIndex = i;
                tempItem.series = workingSet;

                dataSet.push(tempItem);
            }

            return dataSet;
        },

        closest: function (mouse) {

            var
            series = this.series,
                options = this.options,
                relX = mouse.relX,
                relY = mouse.relY,
                compare = Number.MAX_VALUE,
                compareX = Number.MAX_VALUE,
                closest = {},
                closestX = {},
                check = false,
                serie, data, distance, distanceX, distanceY, mouseX, mouseY, x, y, i, j;

            function setClosest(o) {
                o.distance = distance;
                o.distanceX = distanceX;
                o.distanceY = distanceY;
                o.seriesIndex = i;
                o.dataIndex = j;
                o.x = x;
                o.y = y;
            }

            for (i = 0; i < series.length; i++) {

                serie = series[i];
                data = serie.data;
                mouseX = serie.xaxis.p2d(relX);
                mouseY = serie.yaxis.p2d(relY);

                if (data.length) check = true;

                for (j = data.length; j--;) {

                    x = data[j][0];
                    y = data[j][1];

                    if (x === null || y === null) continue;

                    // don't check if the point isn't visible in the current range
                    if (x < serie.xaxis.min || x > serie.xaxis.max) continue;

                    distanceX = Math.abs(x - mouseX);
                    distanceY = Math.abs(y - mouseY);

                    // Skip square root for speed
                    distance = distanceX * distanceX + distanceY * distanceY;

                    if (distance < compare) {
                        compare = distance;
                        setClosest(closest);
                    }

                    if (distanceX < compareX) {
                        compareX = distanceX;
                        setClosest(closestX);
                    }
                }
            }

            return check ? {
                point: closest,
                x: closestX
            } : false;
        },
        

        drawMouseTrack: function (n) {
            var multipleItems = false;
        	if(n.multipleItems){
            	multipleItems = n;
            	//@TODO:
            	//Always defaulting to first item for where to show the hit deal
            	//in future we can do this for the mouse over occurance
            	n = this.hit.formatMultipleToSingle(n, n.dataSets[0]);
            }
            
            var
            pos = '',
                s = n.series,
                p = n.mouse.position,
                m = n.mouse.margin,
                elStyle = S_MOUSETRACK,
                mouseTrack = this.mouseTrack,
                plotOffset = this.plotOffset,
                left = plotOffset.left,
                right = plotOffset.right,
                bottom = plotOffset.bottom,
                top = plotOffset.top,
                decimals = n.mouse.trackDecimals,
                options = this.options;

            // Create
            if (!mouseTrack) {
                mouseTrack = D.node('<div class="line_pop_over"></div>');
                this.mouseTrack = mouseTrack;
                D.insert(this.el, mouseTrack);
            }

            if (!n.mouse.relative) { // absolute to the canvas
                if (p.charAt(0) == 'n') pos += 'top:' + (m + top) + 'px;bottom:auto;';
                else if (p.charAt(0) == 's') pos += 'bottom:' + (m + bottom) + 'px;top:auto;';
                if (p.charAt(1) == 'e') pos += 'right:' + (m + right) + 'px;left:auto;';
                else if (p.charAt(1) == 'w') pos += 'left:' + (m + left) + 'px;right:auto;';

                // Bars
            } else if (s.bars.show) {
                pos += 'bottom:' + (m - top - n.yaxis.d2p(n.y / 2) + this.canvasHeight) + 'px;top:auto;';
                pos += 'left:' + (m + left + n.xaxis.d2p(n.x - options.bars.barWidth / 2)) + 'px;right:auto;';

                // Pie
            } else if (s.pie.show) {
                var center = {
                    x: (this.plotWidth) / 2,
                    y: (this.plotHeight) / 2
                },
                    radius = (Math.min(this.canvasWidth, this.canvasHeight) * s.pie.sizeRatio) / 2,
                    bisection = n.sAngle < n.eAngle ? (n.sAngle + n.eAngle) / 2 : (n.sAngle + n.eAngle + 2 * Math.PI) / 2;

                pos += 'bottom:' + (m - top - center.y - Math.sin(bisection) * radius / 2 + this.canvasHeight) + 'px;top:auto;';
                pos += 'left:' + (m + left + center.x + Math.cos(bisection) * radius / 2) + 'px;right:auto;';

                // Default
            } else {
                if (p.charAt(0) == 'n') pos += 'bottom:' + (m - top - n.yaxis.d2p(n.y) + this.canvasHeight) + 'px;top:auto;';
                else if (p.charAt(0) == 's') pos += 'top:' + (m + top + n.yaxis.d2p(n.y)) + 'px;bottom:auto;';
                if (p.charAt(1) == 'e') pos += 'left:' + (m + left + n.xaxis.d2p(n.x)) + 'px;right:auto;';
                else if (p.charAt(1) == 'w') pos += 'right:' + (m - left - n.xaxis.d2p(n.x) + this.canvasWidth) + 'px;left:auto;';
            }

            elStyle += pos;
            mouseTrack.style.cssText = elStyle;

            if (!decimals || decimals < 0) decimals = 0;

            mouseTrack.innerHTML = n.mouse.trackFormatter({
                x: n.x.toFixed(decimals),
                y: n.y.toFixed(decimals),
                series: n.series,
                index: n.index,
                nearest: n,
                fraction: n.fraction,
                multipleItems: multipleItems
            });

            D.show(mouseTrack);
        },
        

        formatMultipleToSingle : function (n, dataSet) {
        	var returnObj = {};
        	for(key in dataSet){
        		//populate returnObject
        		returnObj[key] = dataSet[key];
        	}
        	returnObj.mouse = n.mouse;
        	
        	return returnObj;
        }

    });
})();