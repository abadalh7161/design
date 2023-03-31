import React from 'react'
import {Box, Text} from '@primer/react'

const getPreviewComponents = (thumbnails, property, setProperties = {}) => {
  const values = []
  const previewComponents = []

  const preparedThumbnails = thumbnails.map(t => ({
    ...t,
    props: Object.fromEntries(t.props),
  }))

  valueLoop: for (const preview of preparedThumbnails) {
    // value already in array
    if (values.includes(preview.props[property])) continue
    // definedProperty wrong
    for (const [setProp, setVal] of Object.entries(setProperties)) {
      if (!preview.props[setProp] || preview.props[setProp] !== setVal.toLowerCase()) {
        continue valueLoop
      }
    }
    // valid component
    values.push(preview.props[property])
    previewComponents.push({...preview, ...{propertyValue: preview.props[property]}})
  }

  return previewComponents
}

export default function FigmaPropertyPreview({
  thumbnails,
  property,
  setProperties = {},
  column = undefined,
  hideLabels = false,
}) {
  const previewComponents = getPreviewComponents(thumbnails, property, setProperties)
  const direction = column === undefined ? 'row' : 'column'
  const previewItemBoxFlexDirection = 'column'

  return (
    <Box
      paddingY={8}
      bg="canvas.subtle"
      borderRadius={10}
      marginBottom={6}
      display="flex"
      alignItems="stretch"
      justifyContent="center"
      flexWrap="wrap"
      flexDirection={direction}
      sx={{
        gap: 4,
      }}
    >
      {previewComponents.map(component => {
        const componentName = Object.entries(component.props)
          .flatMap(propArr => propArr.join(': '))
          .join(', ')

        return (
          <Box
            key={componentName}
            sx={{display: 'flex', flexDirection: previewItemBoxFlexDirection, alignItems: 'center', gap: 2}}
          >
            <Box sx={{flexGrow: '1', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
              <img width="50%" src={component.url} alt={componentName} />
            </Box>
            {!hideLabels && (
              <Text sx={{fontSize: '1', color: 'fg.subtle', verticalAlign: 'middle'}}>{component.propertyValue}</Text>
            )}
          </Box>
        )
      })}
    </Box>
  )
}
