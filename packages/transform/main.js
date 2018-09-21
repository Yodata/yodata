import Context from './src/context'

export {default as Context} from './src/context'
export {default as defaultProps} from './src/helpers/defaultProps'
export {default as getIn} from './src/helpers/getIn'
export {default as parseContext} from './src/parseContext'

export function createContext(cdef) {
	return new Context(cdef)
}
