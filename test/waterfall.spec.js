import test from 'ava';
import sinon from 'sinon';
import root from 'window-or-global';
import waterfall from '../src/waterfall';

const getNewAd = () => ( { wrapper: {} } );

test('must return a promise', t =>
  t.true(waterfall(() => Promise.resolve(), {}, [{}]) instanceof Promise)
);

test('must fail if is passed an empty waterfall', t =>
  t.throws(waterfall(() => Promise.resolve(), {}, []), sinon.match([]).test)
);

test('must allow custom ad chain validation', t => {
  const ad1 = getNewAd();
  const ad2 = { ad: {} };
  const adWaterfall = [ad1, ad2];

  const wrapperChain = sinon.stub();
  const validate = sinon.stub();

  wrapperChain
    .onFirstCall().returns(Promise.resolve(ad1))
    .onSecondCall().returns(Promise.resolve(ad2))

  validate
    .onFirstCall().returns(Promise.reject())
    .onSecondCall().returnsArg(0);

  return waterfall(wrapperChain, { validate }, adWaterfall)
    .then(() => {
      t.true(validate.firstCall.calledWith(ad1));
      t.true(validate.secondCall.calledWith(ad2));
    });
});

test('must do the first ad\'s wrapper chain', t => {
  const ad1 = getNewAd();
  const adWaterfall = [ad1, {}];
  const wrapperChain = sinon.stub().returns(Promise.resolve());

  return waterfall(wrapperChain, {}, adWaterfall)
    .then(() => {
      t.true(wrapperChain.calledOnce);
      t.true(wrapperChain.calledWith(ad1));
    });
});

test('must keep doing next ad\'s wrapper chains until success', t => {
  const successfulAd = { ad: {} };
  const adWaterfall = [getNewAd(), getNewAd(), successfulAd];
  const wrapperChain = sinon.stub();
  
  wrapperChain
    .onFirstCall().returns(Promise.reject())
    .onSecondCall().returns(Promise.reject())
    .onThirdCall().returns(Promise.resolve(successfulAd));
    
  return waterfall(wrapperChain, {}, adWaterfall)
    .then(validAd => {
      t.deepEqual(validAd, successfulAd);
      t.true(wrapperChain.calledThrice);
      adWaterfall.forEach((ad, index) => {
        t.true(wrapperChain.getCall(index).calledWith(ad));
      });
    });
});

test('must fails if all chains fail', t => {
  const adWaterfall = [getNewAd(), getNewAd(), getNewAd()];
  const wrapperChain = sinon.stub();

  var errors = ['invalid', 'not supported', 'no ads'];
  errors.forEach((err, callNr) => 
    wrapperChain
      .onCall(callNr).returns(Promise.reject(err))
  );
  
  t.throws(waterfall(wrapperChain, {}, adWaterfall), sinon.match(errors).test);
});
