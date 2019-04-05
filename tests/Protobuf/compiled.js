/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const oip5 = $root.oip5 = (() => {

    /**
     * Namespace oip5.
     * @exports oip5
     * @namespace
     */
    const oip5 = {};

    oip5.records = (function() {

        /**
         * Namespace records.
         * @memberof oip5
         * @namespace
         */
        const records = {};

        records.RecordTemplate = (function() {

            /**
             * Properties of a RecordTemplate.
             * @memberof oip5.records
             * @interface IRecordTemplate
             * @property {string|null} [friendlyName] RecordTemplate friendlyName
             * @property {string|null} [description] RecordTemplate description
             * @property {Uint8Array|null} [DescriptorSetProto] RecordTemplate DescriptorSetProto
             * @property {number|Long|null} [identifier] RecordTemplate identifier
             * @property {Array.<number|Long>|null} ["extends"] RecordTemplate extends
             */

            /**
             * Constructs a new RecordTemplate.
             * @memberof oip5.records
             * @classdesc Represents a RecordTemplate.
             * @implements IRecordTemplate
             * @constructor
             * @param {oip5.records.IRecordTemplate=} [properties] Properties to set
             */
            function RecordTemplate(properties) {
                this["extends"] = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * RecordTemplate friendlyName.
             * @member {string} friendlyName
             * @memberof oip5.records.RecordTemplate
             * @instance
             */
            RecordTemplate.prototype.friendlyName = "";

            /**
             * RecordTemplate description.
             * @member {string} description
             * @memberof oip5.records.RecordTemplate
             * @instance
             */
            RecordTemplate.prototype.description = "";

            /**
             * RecordTemplate DescriptorSetProto.
             * @member {Uint8Array} DescriptorSetProto
             * @memberof oip5.records.RecordTemplate
             * @instance
             */
            RecordTemplate.prototype.DescriptorSetProto = $util.newBuffer([]);

            /**
             * RecordTemplate identifier.
             * @member {number|Long} identifier
             * @memberof oip5.records.RecordTemplate
             * @instance
             */
            RecordTemplate.prototype.identifier = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * RecordTemplate extends.
             * @member {Array.<number|Long>} extends
             * @memberof oip5.records.RecordTemplate
             * @instance
             */
            RecordTemplate.prototype["extends"] = $util.emptyArray;

            /**
             * Creates a new RecordTemplate instance using the specified properties.
             * @function create
             * @memberof oip5.records.RecordTemplate
             * @static
             * @param {oip5.records.IRecordTemplate=} [properties] Properties to set
             * @returns {oip5.records.RecordTemplate} RecordTemplate instance
             */
            RecordTemplate.create = function create(properties) {
                return new RecordTemplate(properties);
            };

            /**
             * Encodes the specified RecordTemplate message. Does not implicitly {@link oip5.records.RecordTemplate.verify|verify} messages.
             * @function encode
             * @memberof oip5.records.RecordTemplate
             * @static
             * @param {oip5.records.IRecordTemplate} message RecordTemplate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RecordTemplate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.friendlyName != null && message.hasOwnProperty("friendlyName"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.friendlyName);
                if (message.description != null && message.hasOwnProperty("description"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
                if (message.DescriptorSetProto != null && message.hasOwnProperty("DescriptorSetProto"))
                    writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.DescriptorSetProto);
                if (message.identifier != null && message.hasOwnProperty("identifier"))
                    writer.uint32(/* id 10, wireType 1 =*/81).fixed64(message.identifier);
                if (message["extends"] != null && message["extends"].length) {
                    writer.uint32(/* id 11, wireType 2 =*/90).fork();
                    for (let i = 0; i < message["extends"].length; ++i)
                        writer.fixed64(message["extends"][i]);
                    writer.ldelim();
                }
                return writer;
            };

            /**
             * Encodes the specified RecordTemplate message, length delimited. Does not implicitly {@link oip5.records.RecordTemplate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof oip5.records.RecordTemplate
             * @static
             * @param {oip5.records.IRecordTemplate} message RecordTemplate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            RecordTemplate.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a RecordTemplate message from the specified reader or buffer.
             * @function decode
             * @memberof oip5.records.RecordTemplate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {oip5.records.RecordTemplate} RecordTemplate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RecordTemplate.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.oip5.records.RecordTemplate();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.friendlyName = reader.string();
                        break;
                    case 2:
                        message.description = reader.string();
                        break;
                    case 4:
                        message.DescriptorSetProto = reader.bytes();
                        break;
                    case 10:
                        message.identifier = reader.fixed64();
                        break;
                    case 11:
                        if (!(message["extends"] && message["extends"].length))
                            message["extends"] = [];
                        if ((tag & 7) === 2) {
                            let end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message["extends"].push(reader.fixed64());
                        } else
                            message["extends"].push(reader.fixed64());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a RecordTemplate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof oip5.records.RecordTemplate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {oip5.records.RecordTemplate} RecordTemplate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            RecordTemplate.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a RecordTemplate message.
             * @function verify
             * @memberof oip5.records.RecordTemplate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            RecordTemplate.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.friendlyName != null && message.hasOwnProperty("friendlyName"))
                    if (!$util.isString(message.friendlyName))
                        return "friendlyName: string expected";
                if (message.description != null && message.hasOwnProperty("description"))
                    if (!$util.isString(message.description))
                        return "description: string expected";
                if (message.DescriptorSetProto != null && message.hasOwnProperty("DescriptorSetProto"))
                    if (!(message.DescriptorSetProto && typeof message.DescriptorSetProto.length === "number" || $util.isString(message.DescriptorSetProto)))
                        return "DescriptorSetProto: buffer expected";
                if (message.identifier != null && message.hasOwnProperty("identifier"))
                    if (!$util.isInteger(message.identifier) && !(message.identifier && $util.isInteger(message.identifier.low) && $util.isInteger(message.identifier.high)))
                        return "identifier: integer|Long expected";
                if (message["extends"] != null && message.hasOwnProperty("extends")) {
                    if (!Array.isArray(message["extends"]))
                        return "extends: array expected";
                    for (let i = 0; i < message["extends"].length; ++i)
                        if (!$util.isInteger(message["extends"][i]) && !(message["extends"][i] && $util.isInteger(message["extends"][i].low) && $util.isInteger(message["extends"][i].high)))
                            return "extends: integer|Long[] expected";
                }
                return null;
            };

            /**
             * Creates a RecordTemplate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof oip5.records.RecordTemplate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {oip5.records.RecordTemplate} RecordTemplate
             */
            RecordTemplate.fromObject = function fromObject(object) {
                if (object instanceof $root.oip5.records.RecordTemplate)
                    return object;
                let message = new $root.oip5.records.RecordTemplate();
                if (object.friendlyName != null)
                    message.friendlyName = String(object.friendlyName);
                if (object.description != null)
                    message.description = String(object.description);
                if (object.DescriptorSetProto != null)
                    if (typeof object.DescriptorSetProto === "string")
                        $util.base64.decode(object.DescriptorSetProto, message.DescriptorSetProto = $util.newBuffer($util.base64.length(object.DescriptorSetProto)), 0);
                    else if (object.DescriptorSetProto.length)
                        message.DescriptorSetProto = object.DescriptorSetProto;
                if (object.identifier != null)
                    if ($util.Long)
                        (message.identifier = $util.Long.fromValue(object.identifier)).unsigned = false;
                    else if (typeof object.identifier === "string")
                        message.identifier = parseInt(object.identifier, 10);
                    else if (typeof object.identifier === "number")
                        message.identifier = object.identifier;
                    else if (typeof object.identifier === "object")
                        message.identifier = new $util.LongBits(object.identifier.low >>> 0, object.identifier.high >>> 0).toNumber();
                if (object["extends"]) {
                    if (!Array.isArray(object["extends"]))
                        throw TypeError(".oip5.records.RecordTemplate.extends: array expected");
                    message["extends"] = [];
                    for (let i = 0; i < object["extends"].length; ++i)
                        if ($util.Long)
                            (message["extends"][i] = $util.Long.fromValue(object["extends"][i])).unsigned = false;
                        else if (typeof object["extends"][i] === "string")
                            message["extends"][i] = parseInt(object["extends"][i], 10);
                        else if (typeof object["extends"][i] === "number")
                            message["extends"][i] = object["extends"][i];
                        else if (typeof object["extends"][i] === "object")
                            message["extends"][i] = new $util.LongBits(object["extends"][i].low >>> 0, object["extends"][i].high >>> 0).toNumber();
                }
                return message;
            };

            /**
             * Creates a plain object from a RecordTemplate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof oip5.records.RecordTemplate
             * @static
             * @param {oip5.records.RecordTemplate} message RecordTemplate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            RecordTemplate.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object["extends"] = [];
                if (options.defaults) {
                    object.friendlyName = "";
                    object.description = "";
                    if (options.bytes === String)
                        object.DescriptorSetProto = "";
                    else {
                        object.DescriptorSetProto = [];
                        if (options.bytes !== Array)
                            object.DescriptorSetProto = $util.newBuffer(object.DescriptorSetProto);
                    }
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.identifier = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.identifier = options.longs === String ? "0" : 0;
                }
                if (message.friendlyName != null && message.hasOwnProperty("friendlyName"))
                    object.friendlyName = message.friendlyName;
                if (message.description != null && message.hasOwnProperty("description"))
                    object.description = message.description;
                if (message.DescriptorSetProto != null && message.hasOwnProperty("DescriptorSetProto"))
                    object.DescriptorSetProto = options.bytes === String ? $util.base64.encode(message.DescriptorSetProto, 0, message.DescriptorSetProto.length) : options.bytes === Array ? Array.prototype.slice.call(message.DescriptorSetProto) : message.DescriptorSetProto;
                if (message.identifier != null && message.hasOwnProperty("identifier"))
                    if (typeof message.identifier === "number")
                        object.identifier = options.longs === String ? String(message.identifier) : message.identifier;
                    else
                        object.identifier = options.longs === String ? $util.Long.prototype.toString.call(message.identifier) : options.longs === Number ? new $util.LongBits(message.identifier.low >>> 0, message.identifier.high >>> 0).toNumber() : message.identifier;
                if (message["extends"] && message["extends"].length) {
                    object["extends"] = [];
                    for (let j = 0; j < message["extends"].length; ++j)
                        if (typeof message["extends"][j] === "number")
                            object["extends"][j] = options.longs === String ? String(message["extends"][j]) : message["extends"][j];
                        else
                            object["extends"][j] = options.longs === String ? $util.Long.prototype.toString.call(message["extends"][j]) : options.longs === Number ? new $util.LongBits(message["extends"][j].low >>> 0, message["extends"][j].high >>> 0).toNumber() : message["extends"][j];
                }
                return object;
            };

            /**
             * Converts this RecordTemplate to JSON.
             * @function toJSON
             * @memberof oip5.records.RecordTemplate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            RecordTemplate.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return RecordTemplate;
        })();

        return records;
    })();

    return oip5;
})();

export { $root as default };
