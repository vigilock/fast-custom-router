declare module "errors/EmptyConfigFile" {
    /** Error that indicates configuration file is empty. */
    export default class EmptyConfigFile extends Error {
    }
}
declare module "errors/EmptyMethods" {
    /** Indicates that a route does not provide methods. */
    export default class EmptyMethods extends Error {
        constructor(name: any);
    }
}
declare module "errors/EmptyRoutes" {
    /** Indicates that a root does not provide routes. */
    export default class EmptyRoutes extends Error {
        constructor(name: any);
    }
}
declare module "errors/FileNotFound" {
    /**
     * File not found error.
     *
     * Thrown when trying to read a nonexistent file.
     */
    export default class FileNotFound extends Error {
        /**
         * Create a FileNotFound error.
         *
         * @param {string} filepath Path to unknown file
         * @throws {Error} Throwed if filepath parameter is not valid (null || undefined)
         */
        constructor(filepath: string);
    }
}
declare module "errors/InvalidArgument" {
    /** Indicates that an configuration option is not as it must be. */
    export default class InvalidArgument extends Error {
    }
}
declare module "errors/InvalidRouteElement" {
    /** Indicates that a route is invalid. */
    export default class InvalidRouteElement extends Error {
    }
}
declare module "errors/ModuleNotFound" {
    /**
     * Module not found error.
     *
     * Thrown when trying to load a nonexistent module.
     */
    export default class ModuleNotFound extends Error {
        /**
         * Create a ModuleNotFound error.
         *
         * @param {string} filepath Path to unknown module
         */
        constructor(filepath: string);
    }
}
declare module "errors/ValidationData" {
    /**
     * Validation data error.
     *
     * Thrown when data sent are invalid.
     */
    export default class ValidationDataError extends Error {
        /**
         * Create a ValidationDataError error.
         *
         * @param {string} code HTTP error code
         * @param {string} name Name of the error
         * @param {string} message Message of the error
         */
        constructor(code: string, name: string, message: string);
        code: string;
    }
}
/**
 * Router api
 */
type Router = {
    /**
     * Use middleware
     */
    use: Function;
    /**
     * Get router method
     */
    get: Function;
    /**
     * Post router method
     */
    post: Function;
    /**
     * Put router method
     */
    put: Function;
    /**
     * Patch router method
     */
    patch: Function;
    /**
     * Delete router method
     */
    delete: Function;
};
type RouterElementMiddleware = {
    pre_middlewares: Middleware[];
    post_middlewares: Middleware[];
};
type Middleware = {
    name: string | undefined;
    middleware: Function | undefined;
};
/**
 * Request api
 */
type Request = {
    /**
     * Request params
     */
    params: object;
    /**
     * Request body
     */
    body: object;
};
/**
 * Next function api
 */
type RequestHandler = Function;
/**
 * Route parameter
 */
type Parameter = {
    /**
     * Cast function
     */
    type: Function;
    /**
     * Value that need to be valided
     */
    value: any;
    /**
     * True if the parameter is optionnal
     */
    optionnal?: boolean;
    /**
     * Default value if the value is wrong
     */
    defaultValue?: any;
};
/**
 * Route configuration
 */
type RouterConfiguration = {
    /**
     * Route path
     */
    path: string;
    /**
     * Route controller
     */
    controller: Function;
    /**
     * Default status code on success, 200 by default
     */
    successStatusCode: number;
    /**
     * List of parameters to be valided
     */
    getParams: (req: Request) => [Parameter];
};
/**
 * Router root configuration
 */
type RootObject = {
    /**
     * Root of a set of routes
     */
    root: string;
    /**
     * List of middleware names, called before routes
     */
    pre_middlewares?: string[];
    /**
     * List of middleware names, called after routes
     */
    post_middlewares?: string[];
    /**
     * Routes inside the root
     */
    routes: (RootObject | RouteObject)[];
};
/**
 * Express route
 */
type RouteObject = {
    /**
     * Route path with parameters (eg.: '/my-path/:param)
     */
    path: string;
    /**
     * List of middleware names, called before routes
     */
    pre_middlewares?: string[];
    /**
     * List of middleware names, called after routes
     */
    post_middlewares?: string[];
    /**
     * Defines methods that is
     */
    methods: {
        string: RouteMethodObject;
    }[];
};
/**
 * Route method
 */
type RouteMethodObject = {
    /**
     * Route controller name
     */
    controller: string;
    /**
     * List of middleware names, called before routes
     */
    pre_middlewares?: string[];
    /**
     * List of middleware names, called after routes
     */
    post_middlewares?: string[];
    /**
     * Response code that is returned on route call success, 200 by default. Default is `200`
     */
    response_code?: number;
    /**
     * <string, string>} body Request body parameters that are required
     */
    "": object;
};
/**
 * Route parameter
 */
type RouteParameterObject = {
    /**
     * Type of the value
     */
    type: string;
    /**
     * Default value of the parameter, implicit optionnal declaration
     */
    default_value: any;
};
/**
 * HTTP request method that is allowed
 */
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
/**
 * Parser configuration
 */
type ParserConfig = {
    /**
     * Absolute path that contains router configuration
     */
    config_dir: string;
    /**
     * Absolute path that contains router controllers
     */
    controller_dir: string;
    /**
     * Absolute path that contains router middlewares
     */
    middleware_dir: string;
    /**
     * Default http response code
     */
    http_default_response_code: number;
    /**
     * List of authorized http response codes
     */
    http_responses_code: number[];
};
type ControllerParameter = {
    /**
     * : This.__getBody(req),
     */
    body: object;
    /**
     * : Req.headers,
     */
    headers: object;
    /**
     * : This.__getParams(req),
     */
    params: object;
    /**
     * : Req.query,
     */
    query: object;
    /**
     * : SetStatus,
     */
    status: object;
    etc: object[];
};
declare module "models/RouterElement" {
    /** Check if child element has unused arguments. */
    export default class RouterElement {
        /**
         * Check if child element has unused arguments.
         *
         * @param {string} childName Child of this class
         * @param {object} config Child configuration
         * @param {string[]} [params=[]] Used params. Default is `[]`
         */
        constructor(childName: string, config: object, params?: string[]);
        childName: string;
        /**
         * Check if config is defined.
         *
         * @param {object} config Router element configuration
         */
        __parseEmptyConfig(config: object): void;
        /**
         * Check if configuration has unused options.
         *
         * @param {string[]} params List of configuration option name
         * @param {object} config Router element configuration
         */
        __parseUnusedArguments(params: string[], config: object): void;
        /**
         * Load controller from name and parser configuration.
         *
         * @param {string} name Module name
         * @param {string} directory Module directory
         * @returns {Promise<Function>} Module
         */
        __loadModule(name: string, directory: string): Promise<Function>;
    }
}
declare module "Validation" {
    /**
     * Valid each parameters for the route on call.
     *
     * @param {Parameter[]} params Route parameters
     * @param {Function} next Next function from express router
     * @returns {{ validedParams: [any]; paramsAreValid: Boolean }} ValidedParams is filtered data, and paramsAreValid indicates if all parameters are valid
     */
    export function validParams(params: Parameter[], next: Function): {
        validedParams: [any];
        paramsAreValid: boolean;
    };
    namespace _default {
        function NUMBER(value: any): number;
        const STRING: StringConstructor;
        function BOOLEAN(value: any): boolean;
        const OBJECT: ObjectConstructor;
        const MAIL: RegExp;
    }
    export default _default;
}
declare module "models/RouteParameter" {
    /**
     * Route parameter.
     *
     * It is a body resquest as req.params.id.
     */
    export default class RouteParameter extends RouterElement {
        /**
         * Instanciate RouteParameter object
         *
         * @param {string} name Name of the parameter
         * @param {RouteParameterObject | string} config Parameter configuration
         */
        constructor(name: string, config: RouteParameterObject | string);
        name: string;
        /** @type {RegExp | Function} */
        type: RegExp | Function;
        optionnal: boolean;
        default_value: any;
        /**
         * Parse name.
         *
         * @param {string} name Parameter name
         */
        __parseName(name: string): void;
        /**
         * Parse parameter type.
         *
         * @param {string} type Type name
         */
        __parseType(type: string): void;
        /**
         * Parse default value for parameter.
         *
         * @param {any} default_value Default value
         */
        __parseDefaultValue(default_value: any): void;
        /**
         * Valid data on request.
         *
         * @param {any} value Value to be valided
         * @returns {any} Valided value
         */
        valid(value: any): any;
    }
    import RouterElement from "models/RouterElement";
}
declare module "models/Import" {
    /** Load configuration file when import is explicited. */
    export default class Import extends RouterElement {
        /**
         * Instanciate imports.
         *
         * @param {string[]} files List of configuration files
         * @param {ParserConfig} parserConfig Parser configuration
         * @param {Function} parser Parser function
         * @param {RouteParameter[]} [extraParams=[]] Root params parameters. Default is `[]`
         */
        constructor(files: string[], parserConfig: ParserConfig, parser: Function, extraParams?: RouteParameter[]);
        __parseRouteElements: Function;
        routes: any[];
        params: RouteParameter[];
        /**
         * Load configuration files.
         *
         * @param {string[]} files File paths
         * @param {ParserConfig} parserConfig Parser configuration
         */
        __parseFiles(files: string[], parserConfig: ParserConfig): void;
        /**
         * Load sub root and routes from name and parser configuration.
         *
         * @param {Router} router Express router
         * @param {string} path Middleware path
         * @param {ParserConfig} config Parser configuration
         */
        load(router: Router, path: string, config: ParserConfig): Promise<void>;
    }
    import RouterElement from "models/RouterElement";
    import RouteParameter from "models/RouteParameter";
}
declare module "models/Middleware" {
    /** Middleware element for custom router. */
    export default class Middleware extends RouterElement {
        /**
         * Instanciate Middleware object
         *
         * @param {string} name Middleware name
         */
        constructor(name: string);
        name: string;
        middleware: Function;
        /**
         * Parse middleware name.
         *
         * @param {string} name Middleware name
         * @throws {InvalidArgument}
         */
        __parseName(name: string): void;
        /**
         * Load middleware from name and parser configuration
         *
         * @param {Router} router Express router
         * @param {string} path Middleware path
         * @param {string} middlewareDir Controller directory
         */
        load(router: Router, path: string, middlewareDir: string): Promise<void>;
    }
    import RouterElement from "models/RouterElement";
}
declare module "__constants__" {
    /** Regular expression that valid url paths. */
    export const PATH_REGEX: RegExp;
    /** List of accepted http request methods. */
    export const ACCEPTED_METHODS: string[];
    /** List of accept HTTP response code on controller call successful. */
    export const HTTP_RESPONSE_CODE: number[];
    /** Default HTTP response code */
    export const HTTP_DEFAULT_RESPONSE_CODE: 200;
    /** Custom request parameter that allow to add arguments to a controller. */
    export const CUSTOM_ARG_NAME: "__fcr_custom_params";
}
declare module "models/RouterElementMiddleware" {
    /** Check if child element has unused arguments. */
    export default class RouterElementMiddleware extends RouterElement {
        pre_middlewares: Middleware[];
        post_middlewares: Middleware[];
        /**
         * Check if middlewares are valid.
         *
         * @param {string[]} middlewares Middleware list
         * @returns {Middleware[]} List of middleware objects
         */
        __parseMiddlewares(middlewares: string[]): Middleware[];
        /**
         * Load middlewares
         *
         * @param {Middleware[]} middlewares List of middlewares
         * @param {Router} router Express router
         * @param {string} path URI path
         * @param {string} middlewareDir Middleware directory path
         */
        __loadMiddlewares(middlewares: Middleware[], router: Router, path: string, middlewareDir: string): Promise<void>;
        /**
         * Load pre middlewares
         *
         * @param {Router} router Express router
         * @param {string} path URI path
         * @param {string} middlewareDir Middleware directory path
         */
        __loadPreMiddlewares(router: Router, path: string, middlewareDir: string): Promise<void>;
        /**
         * Load post middlewares
         *
         * @param {Router} router Express router
         * @param {string} path URI path
         * @param {string} middlewareDir Middleware directory path
         */
        __loadPostMiddlewares(router: Router, path: string, middlewareDir: string): Promise<void>;
    }
    import RouterElement from "models/RouterElement";
    import Middleware from "models/Middleware";
}
declare module "util/StringUtil" {
    /**
     * Indent a text.
     *
     * @param {string} str Text to ident
     * @param {string} fill Text to fill
     * @param {number} it Number of indentation
     * @returns {string} Indented text
     */
    export function padStartText(str: string, fill?: string, it?: number): string;
}
declare module "models/RouteMethod" {
    /** Route method of a Route. */
    export default class RouteMethod extends RouterElement {
        /**
         * Intanciate RouteMethod object.
         *
         * @param {RequestMethod} method Route method
         * @param {RouteMethodObject} config Route configuration
         */
        constructor(method: RequestMethod, config: RouteMethodObject);
        name: string;
        controller_name: string;
        controller: Function;
        response_code: number;
        abstract: boolean;
        /** @type {RouteParameter[]} */
        params: RouteParameter[];
        /** @type {RouteParameter[]} */
        body: RouteParameter[];
        /**
         * Parse method name.
         *
         * @param {string} method HTTP method
         * @throws {InvalidArgument}
         */
        __parseMethod(method: string): void;
        /**
         * Parse controller name.
         *
         * @param {string} controller Controller name
         * @throws {InvalidArgument}
         */
        __parseControllerName(controller: string): void;
        /**
         * Parse HTTP response code for success controller response.
         *
         * @param {number} code Default HTTP response code
         * @throws {InvalidArgument}
         */
        __parseResponseCode(code: number): void;
        /**
         * Parse abstract flag for controller call.
         *
         * @param {boolean} abstract Abstract or not
         */
        __parseAbstract(abstract: boolean): void;
        /**
         * Parse body arguments.
         *
         * @param {{ string: { type: string; default_value: any } }} body Body arguments
         * @returns {void}
         * @throws {InvalidArgument}
         */
        __parseBody(body: {
            string: {
                type: string;
                default_value: any;
            };
        }): void;
        /**
         * Get valided params parameters.
         *
         * @param {Request} req Express request
         * @returns {object} Params parameters
         */
        __getParams(req: Request): object;
        /**
         * Get valided body parameters.
         *
         * @param {Request} req Express request
         * @returns {object} Body parameters
         */
        __getBody(req: Request): object;
        /**
         * Give route function.
         *
         * @param {Function} controller Route controller
         * @param {number} statusCode HTTP response code
         * @returns {Function} Route function
         */
        __getRoute(controller: Function, statusCode: number): Function;
        /**
         * Load controller from name and parser configuration.
         *
         * @param {Router} router Express router
         * @param {string} path Middleware path
         * @param {ParserConfig} config Parser configuration
         * @param {Middleware[]} preMiddlewares Pre-middlewares
         * @param {Middleware[]} postMiddlewares Post-middlewares
         */
        load(router: Router, path: string, config: ParserConfig, preMiddlewares?: Middleware[], postMiddlewares?: Middleware[]): Promise<void>;
    }
    import RouterElement from "models/RouterElement";
    import RouteParameter from "models/RouteParameter";
    import Middleware from "models/Middleware";
}
declare module "models/Route" {
    /** Route element of the custom router. */
    export default class Route extends RouterElementMiddleware {
        /**
         * Instanciate Route object
         *
         * @param {string} name Name of the route
         * @param {RouteObject} config Route configuration
         * @param {RouteParameter[]} [extraParams=[]] Root params parameters. Default is `[]`
         */
        constructor(name: string, config: RouteObject, extraParams?: RouteParameter[]);
        name: string;
        path: string;
        params: RouteParameter[];
        /** @type {RouteMethod[]} */
        methods: RouteMethod[];
        /**
         * Parse uri path.
         *
         * @param {string} path Uri path
         */
        __parsePath(path: string): void;
        /**
         * Parse params parameters
         *
         * @param {RouteParameterObject[]} params List of parameters
         * @returns {void}
         * @throws {InvalidArgument}
         */
        __parseParams(params: RouteParameterObject[]): void;
        /**
         * Parse uri methods.
         *
         * @param {RouteMethodObject} methods Route methods
         * @returns {void}
         * @throws {InvalidArgument}
         * @throws {EmptyMethods}
         */
        __parseMethods(methods: RouteMethodObject): void;
        /**
         * Load routes from name and parser configuration.
         *
         * @param {Router} router Express router
         * @param {string} path Middleware path
         * @param {ParserConfig} config Parser configuration
         * @returns {Promise<void>}
         */
        load(router: Router, path: string, config: ParserConfig): Promise<void>;
    }
    import RouterElementMiddleware from "models/RouterElementMiddleware";
    import RouteParameter from "models/RouteParameter";
    import RouteMethod from "models/RouteMethod";
}
declare module "models/Root" {
    /** Root element of the custom router. */
    export default class Root extends RouterElementMiddleware {
        /**
         * Parse a root object
         *
         * @param {string} name Root name
         * @param {RootObject} config Root configuration
         * @param {ParserConfig} parserConfig Parser configuration
         * @param {Function} parser Parser function
         * @param {RouteParameter[]} [extraParams=[]] Root params parameters. Default is `[]`
         */
        constructor(name: string, config: RootObject, parserConfig: ParserConfig, parser: Function, extraParams?: RouteParameter[]);
        __parseRouteElements: Function;
        name: string;
        root: string;
        params: RouteParameter[];
        /** @type {Root[]} */
        routes: Root[];
        /**
         * Parse root parameter
         *
         * @param {string} root Root root
         */
        __parseRoot(root: string): void;
        /**
         * Parse params parameters
         *
         * @param {RouteParameterObject[]} params List of parameters
         */
        __parseParams(params: RouteParameterObject[]): void;
        /**
         * Parse root routes
         *
         * @param {RouteObject[]} routes List of routes objects
         * @param {ParserConfig} parserConfig Parser configuration
         */
        __parseRoutes(routes: RouteObject[], parserConfig: ParserConfig): void;
        /**
         * Load sub root and routes from name and parser configuration.
         *
         * @param {Router} router Express router
         * @param {string} path Middleware path
         * @param {ParserConfig} config Parser configuration
         */
        load(router: Router, path: string, config: ParserConfig): Promise<void>;
    }
    import RouterElementMiddleware from "models/RouterElementMiddleware";
    import RouteParameter from "models/RouteParameter";
}
