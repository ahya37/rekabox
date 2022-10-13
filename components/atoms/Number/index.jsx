import NumberFormat from 'react-number-format'

export default function Number({value}) {
  return (
    <NumberFormat  
    value={value} 
    prefix="Rp" 
    displayType="text" 
    thousandSeparator="."
    decimalSeparator=","/>
  )
}
