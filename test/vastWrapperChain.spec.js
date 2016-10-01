import test from 'ava';
import sinon from 'sinon';
import vastWrapperChain from '../src/vastWrapperChain';

const vastWrapperObj = (vasttaguri = "http://example.com/") => ({ 
  vast: {  
      ad: {  
         wrapper: {  
            vasttaguri
         }
      }
   }
});

const nonVastWrapperObj = () => ({  
   vast:{  
      ad:{  
         inline: ""
      }
   }
});


test('must return a promise', t => 
  t.true(vastWrapperChain(() => 
    Promise.resolve(), { adTag:'http://example.com/' }) instanceof Promise));

test('must fetch fetch the ad', t => {
  const fetchAd = sinon.stub().returns(Promise.resolve());
  const config = { adTag:'http://example.com/' };
  vastWrapperChain(fetchAd, config);
  t.true(fetchAd.calledOnce);
  t.true(fetchAd.calledWith(config.adTag, config));
});

test('must recursively fetch ads until it gets a non wrapper ad', t => {
  const config = { adTag:'http://example.com/' };
  const fetchAd = sinon.stub();

  fetchAd
    .onFirstCall().returns(Promise.resolve(vastWrapperObj('http://example.com/1')))
    .onSecondCall().returns(Promise.resolve(vastWrapperObj('http://example.com/2')))
    .onThirdCall().returns(Promise.resolve(nonVastWrapperObj()));

  return vastWrapperChain(fetchAd, config)
    .then(() => {
      t.true(fetchAd.calledThrice);
      t.true(fetchAd.firstCall.calledWith('http://example.com/'))
      t.true(fetchAd.secondCall.calledWith('http://example.com/1'))
      t.true(fetchAd.thirdCall.calledWith('http://example.com/2'))
    });
});

test.todo('must reject the promise if there is a problem fetching the ad');
test.todo('must reject the promise if "maxChainDepth" is reached');
test.todo('must resolve with an array of all the chained wrappers and the ad')
