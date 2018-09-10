import React from 'react';
import { storiesOf } from '@storybook/react';
import {withKnobs, select, boolean} from '@storybook/addon-knobs';
import { Provider } from 'react-redux'
import { createStore } from 'oip-state'

import FilePaymentWrapper from '../src/components/FilePaymentWrapper/FilePaymentWrapper.js';
import PaymentButton from '../src/components/PaymentButton/PaymentButton.js'

import {amsterdam, apocalypse, barbershop, barbershop_paid, CorMetallicum, scout, dweb, sintel} from './TestArtifacts'

import { getArtifactOptions, getFileOptions } from './util';
import { setActiveArtifact } from "oip-state/src/actions/ActiveArtifact/thunks";
import {
	fileToUID,
	setActiveFile,
	paymentCancel,
	paymentError,
	paymentInProgress,
	paymentSuccess
} from "oip-state/src/actions/ActiveArtifactFiles/thunks";



import 'bootstrap/dist/css/bootstrap.min.css'
import StoreDebugHelper from "./StoreDebugHelper";

const stories = storiesOf("FilePaymentWrapper", module);
stories.addDecorator(withKnobs);

let store = createStore();

const artifacts = getArtifactOptions([apocalypse, barbershop, barbershop_paid, amsterdam, scout, CorMetallicum, dweb, sintel]);

const widthLabel = "Parent Div Width";
const widthOptions = {
	"100": "100px",
	"200": "200px",
	"300": "300px",
	"400": "400px",
	"500": "500px",
	"600": "600px",
	"700": "700px",
	"800": "800px",
	"900": "900px",
	"1000": "1000px",
	"1100": "1100px",
	"95": "95%"
};
const widthDefault = '95%';

const posterLabel = "Load with poster";
const posterDefault = false;

stories.add("Test payment state via redux", () => {
	const artifact_value = select(artifacts.title, artifacts.options, "Sintel - Third Open Movie by Blender Foundation");
	const artifact = artifacts.map[artifact_value];

	const artifact_files = getFileOptions(artifact);
	const file_value = select(artifact_files.title, artifact_files.options, artifact_files.default_file);
	const artifact_file = artifact_files.map[file_value];
	let uid = fileToUID(artifact_file)
	console.log("FILE UID: ", uid)
	const width_value = select(widthLabel, widthOptions, widthDefault)
	const loadWithPoster = boolean(posterLabel, posterDefault);

	store.dispatch(setActiveArtifact(artifact));
	// store.dispatch(setActiveFile(artifact_file));

	let filePaymentWrapperOptions = {
		usePosterFile: loadWithPoster
	};
	console.log("Load with poster: ", loadWithPoster);
	let df = 'd-flex justify-content-center';
	return (
		<Provider store={store}>
			<div className="container-fluid p-0">
				<div style={{width: width_value}}>
					<FilePaymentWrapper
						ArtifactFile={artifact_file}
						options={filePaymentWrapperOptions}/>
				</div>
				<div className="row justify-content-center" style={{marginTop: "25px"}}>
					<PaymentButton
						ArtifactFile={artifact_file}
						type={"view"}
						size={"sm"}
					/>
					<span className="mx-1"/>
					<PaymentButton
						ArtifactFile={artifact_file}
						type={"buy"}
						size={"sm"}
					/>
				</div>
				<div className="row justify-content-center" style={{marginTop: "25px"}}>
					<button onClick={() => {store.dispatch(paymentInProgress(artifact_file, "view"))}} type="button" className="btn btn-primary btn-sm ml-2">View/Pay in Progress</button>
					<button onClick={() => {store.dispatch(paymentSuccess(artifact_file, "view"))}} type="button" className="btn btn-primary btn-sm ml-2">View/Pay Success</button>
					<button onClick={() => {store.dispatch(paymentCancel(artifact_file, "view"))}} type="button" className="btn btn-primary btn-sm ml-2">View/Pay Cancel</button>
					<button onClick={() => {store.dispatch(paymentError(artifact_file, "view"))}} type="button" className="btn btn-primary btn-sm ml-2">View/Pay Error</button>
				</div>
				<div className="row justify-content-center" style={{marginTop: "25px"}}>
					<button onClick={() => {store.dispatch(paymentInProgress(artifact_file, "buy"))}} type="button" className="btn btn-danger btn-sm ml-2">Buy in Progress</button>
					<button onClick={() => {store.dispatch(paymentSuccess(artifact_file, "buy"))}} type="button" className="btn btn-danger btn-sm ml-2">Buy Success</button>
					<button onClick={() => {store.dispatch(paymentCancel(artifact_file, "buy"))}} type="button" className="btn btn-danger btn-sm ml-2">Buy Cancel</button>
					<button onClick={() => {store.dispatch(paymentError(artifact_file, "buy"))}} type="button" className="btn btn-danger btn-sm ml-2">Buy Error</button>
				</div>
				<div className="row d-flex justify-content-center" style={{marginTop: "25px"}}>
					<div className={`col-4 ${df}`}><StoreDebugHelper minimize={true} style={{fontSize: '12px'}} path={['ActiveArtifactFiles',`${uid}`,'hasPaid']} /></div>
					<div className={`col-4 ${df}`}><StoreDebugHelper minimize={true} style={{fontSize: '12px'}} path={['ActiveArtifactFiles',`${uid}`,'isPaid']} /></div>
					<div className={`col-4 ${df}`}><StoreDebugHelper minimize={true} style={{fontSize: '12px'}} path={['ActiveArtifactFiles',`${uid}`,'owned']} /></div>
					<div className={`col-4 ${df}`}><StoreDebugHelper minimize={true} style={{fontSize: '12px'}} path={['ActiveArtifactFiles',`${uid}`,'payErrorBuy']} /></div>
					<div className={`col-4 ${df}`}><StoreDebugHelper minimize={true} style={{fontSize: '12px'}} path={['ActiveArtifactFiles',`${uid}`,'payErrorView']} /></div>
					<div className={`col-4 ${df}`}><StoreDebugHelper minimize={true} style={{fontSize: '12px'}} path={['ActiveArtifactFiles',`${uid}`,'payInProgressBuy']} /></div>
					<div className={`col-4 ${df}`}><StoreDebugHelper minimize={true} style={{fontSize: '12px'}} path={['ActiveArtifactFiles',`${uid}`,'payInProgressView']} /></div>
					<div className={`col-4 ${df}`}><StoreDebugHelper minimize={true} style={{fontSize: '12px'}} path={['ActiveArtifactFiles',`${uid}`,'paySuccessBuy']} /></div>
					<div className={`col-4 ${df}`}><StoreDebugHelper minimize={true} style={{fontSize: '12px'}} path={['ActiveArtifactFiles',`${uid}`,'paySuccessView']} /></div>
				</div>
			</div>
		</Provider>
	)
}, {notes: 'This component is hooked up to redux and is loading files based on the active file'});