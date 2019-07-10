import $ from 'jquery';
import 'what-input';

// Foundation JS relies on a global varaible. In ES6, all imports are hoisted
// to the top of the file so if we used`import` to import Foundation,
// it would execute earlier than we have assigned the global variable.
// This is why we have to use CommonJS require() here since it doesn't
// have the hoisting behavior.
window.jQuery = $;
require('foundation-sites');

// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';


$(document).foundation();

/**
 *  BSM aka the BitSetManager
 *  Manages an array of list item IDs / Bitmask pairs
 * 
 */
$.BSM = function() {

    var store = new Array();
    console.log("I AM CALLED");

    const bitMaskOrder = ["qualitative", "quantitative", "behavioural", "attitudinal", 
            "processStrategic", "processExecute", "processAssess", 
            "natural", "scripted", "hybrid", "de-contextualised"];

    // use private helper functions here

    // first instance in the array that matches the id
    function findByKey(key) {
        return store.find(elem => elem.id === key);
    }

    // adds a key value pair to the list of array matches
    function add(key, value) {
        return store.push({id: key, bitmap: value});
    }

    //
    function filterMatches(bitmask) {
        const matches = new Array();
        store.forEach(elem => { console.log(elem.bitmap + " : " + bitmask); if ((bitmask & elem.bitmap) == bitmask) matches.push(elem.id); });
        return matches;
    }

    return {
        findEntry: function(key) {
            return findByKey(key);
        },
        addEntry: function(id, bitmask) {
            return add(id, bitmask);
        },
        getMatches: function(bitmask) {
            return filterMatches(bitmask);
        },
        getBitMaskOrder: function() {
            return bitMaskOrder;
        }
    };

}();


/**
 *  Core App
 * 
 */
$(function() {

    // creates the bitset
    var createBitSets = function() {

        /*
            Create the bitset, in the following order

            #position - attribute
            #0  - qualitative
            #1  - quantitative
            #2  - behavioural
            #3  - attitudinal
            #4  - processStrategic
            #5  - processExecute
            #6  - processAssess

            #7  - natural
            #8  - scripted
            #9  - hybrid
            #10 - de-contextualised
        */

       $("#BitItemList > li").each((idx, nativeElem) => {
 
            let bitset = 0b0;
            // set the appropriate bit on the bitset
            // create a bit mask, then use logical OR to set specified bit
            // (i.e. bitset |= mask_val << #bit_index_to_set)
            bitset |= (nativeElem.dataset.bmQualitative === "true" ? 1 : 0) << 0;
            bitset |= (nativeElem.dataset.bmQuantitative === "true" ? 1 : 0) << 1;
            bitset |= (nativeElem.dataset.bmBehavioural === "true" ? 1 : 0) << 2;
            bitset |= (nativeElem.dataset.bmAttitudinal === "true" ? 1 : 0) << 3;
            bitset |= (nativeElem.dataset.bmProcessStrategic === "true" ? 1 : 0) << 4;
            bitset |= (nativeElem.dataset.bmProcessExecute === "true" ? 1 : 0) << 5;
            bitset |= (nativeElem.dataset.bmProcessAssess === "true" ? 1 : 0) << 6;

            // get the 'context of use' list and flatten this into data attributes
            bitset |= ((nativeElem.dataset.bmContextOfUse).indexOf("natural") > -1 ? 1 : 0) << 7;
            bitset |= ((nativeElem.dataset.bmContextOfUse).indexOf("scripted") > -1 ? 1 : 0) << 8;
            bitset |= ((nativeElem.dataset.bmContextOfUse).indexOf("hybrid") > -1 ? 1 : 0) << 9;
            bitset |= ((nativeElem.dataset.bmContextOfUse).indexOf("de-contextualised") > -1 ? 1 : 0) << 10;

            // store data attribute on element - use native HTML5
            nativeElem.dataset.bitset = bitset;

            // update the BSM
            //$.BitsetManager.addToMap($(nativeElem).attr("id"), bitset);
            $.BSM.addEntry($(nativeElem).attr("id"), bitset)
        });

    }
    createBitSets();


    /**
     *  Filter the list, to show only the matched elements
     *  
     */
    $("#filterForm").submit(function(evt) {

        // stop event propagation of form submission
        evt.preventDefault();

        // Gather the state of the selected form
        let selection = new Array();

        selection.push($("#prodDevPhase option:selected").val());
        selection.push($("#contextOfUse option:selected").val());
        selection.push($("#dataType option:selected").val());
        selection.push($("#questionType option:selected").val());

        let queryMask = 0b0;
        // Build the query mask
        for (var i = 0 ; i < selection.length ; i++) {
            let idxShift = $.BSM.getBitMaskOrder().indexOf(selection[i]);
            let partialMask = 0b0;
            if (idxShift != -1) {
                partialMask |= 1 << idxShift;
                queryMask |= partialMask;
            }
        }
        console.log("queryMask " + queryMask);

        let matches = $.BSM.getMatches(queryMask);
        console.log(matches);

        //console.log(prodDevPhaseSelection + " " +
        //    contextOfUseSelection + " " +
        //    dataTypeSelection + " " +
        //    questionTypeSelection);

        // 2. Iterate over the items in the list and show/hide the content
        $("#BitItemList > li").each((idx, nativeElem) => {

            if (matches.includes(nativeElem.id)) {
                console.log("show: " + nativeElem.id);
                $(nativeElem).css("display", "block");
            } 
            else {
                console.log("hide: " + nativeElem.id);
                $(nativeElem).css("display", "none");
            }
            
        });

    });
});

