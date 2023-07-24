"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotIn = void 0;
const class_validator_1 = require("class-validator");
function NotIn(property, validationOptins) {
    return (object, propertyName) => {
        (0, class_validator_1.registerDecorator)({
            name: 'NotIn',
            target: object.constructor,
            propertyName,
            options: validationOptins,
            constraints: [property],
            validator: {
                validate(value, args) {
                    const [relatePropertyName] = args.constraints;
                    const relatedValue = args.object[relatePropertyName];
                    return typeof value === 'string' && typeof relatedValue === 'string' && !relatedValue.includes(value);
                }
            },
        });
    };
}
exports.NotIn = NotIn;
//# sourceMappingURL=not-in.js.map