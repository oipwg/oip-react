import React from 'react'
import Publisher from '../../../Publisher/Publisher/Publisher'
import EnumRow from '../EnumRow'
import FieldRow from '../FieldRow'
import RecordProto from '../RecordProto'

/** * Loops through webFmt object - returns a functional component ***/
const RecordInterface = ({
  classes,
  webFmt,
  dispatch,
  onSuccess,
  onError,
  getMessage,
  mainnetExplorerUrl,
  testnetExplorerUrl,
  withPublisher,
  extendedTemplates,
  oipdHttpApi,
  root,
  setChildState
}) => {
  return (
    <div className={classes.root}>

      {Object.keys(webFmt.fields).map((field, index) => {
        const fieldData = webFmt.fields[field]
        const enumData = webFmt.enums[webFmt.fields[field].enumRefName]

        if (webFmt.fields[field].enumRefName) {
          return <EnumRow
            key={`${field}-enum-${index}`}
            enumField={field}
            enumData={enumData}
            classes={classes}
            dispatch={dispatch}
          />
        } else {
          return <FieldRow
            key={`${field}-${index}`}
            id={`${field}-${index}`}
            field={field}
            fieldData={fieldData}
            classes={classes}
            dispatch={dispatch}
          />
        }
      })}

      {
        Object.keys(extendedTemplates).map((templateIdentifier, i) => {
          const template = extendedTemplates[templateIdentifier]
          return <RecordProto
            classes={classes}
            key={templateIdentifier}
            mainnetExplorerUrl={mainnetExplorerUrl}
            testnetExplorerUrl={testnetExplorerUrl}
            oipdHttpApi={oipdHttpApi}
            template={template}
            rootKey={`${root}-${i}`}
            __liftDetails={setChildState}
          />
        })
      }

      {withPublisher && <Publisher
        classes={classes}
        onSuccess={onSuccess}
        onError={onError}
        getMessage={getMessage}
        mainnetExplorerUrl={mainnetExplorerUrl}
        testnetExplorerUrl={testnetExplorerUrl}
      />}
    </div>
  )
}

export default RecordInterface
