import test from 'ava';
import { parseString } from 'xml2js';
import { isVastWrapper } from '../src/selectors';

const vastWrapperObj = { 
  vast: {  
      ad: {  
         wrapper:{  
            vasttaguri: "http://expample.com"
         }
      }
   }
};

const nonVastWrapperObj = {  
   vast:{  
      ad:{  
         inline:""
      }
   }
};

test(`isVastWrapper must return true if the vastObj is a VAST wrapper`, t => {
  t.true(isVastWrapper(vastWrapperObj));
});

test(`isVastWrapper must return false otherwise`, t => {
  t.false(isVastWrapper(nonVastWrapperObj));
  t.false(isVastWrapper());
  t.false(isVastWrapper(null));
  t.false(isVastWrapper('foo'));
  t.false(isVastWrapper(function() {}));
});

test.todo('getVastTagUri must return the vastTagUri from the wrapper vastObj');
test.todo('getVastTagUri must return undefined if vastTagUri can not be found')
