import {registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface} from 'class-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: IsCPFConstraint,
        });
    };
}



@ValidatorConstraint({name: 'IsCPF'})
export class IsCPFConstraint implements ValidatorConstraintInterface {

    STRICT_STRIP_REGEX: RegExp = /[.-]/g
    LOOSE_STRIP_REGEX: RegExp = /[^\d]/g

    BLACKLIST: Array<string> = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
    '12345678909'
  ]

    strip = (number: string, strict?: boolean): string => {
    const regex: RegExp = strict ? this.STRICT_STRIP_REGEX : this.LOOSE_STRIP_REGEX
    return (number || '').replace(regex, '')
  }

    verifierDigit = (digits: string): number => {
    const numbers: Array<number> = digits
      .split('')
      .map(number => {
        return parseInt(number, 10)
      })
  
    const modulus: number = numbers.length + 1
    const multiplied: Array<number> = numbers.map((number, index) => number * (modulus - index))
    const mod: number = multiplied.reduce((buffer, number) => buffer + number) % 11
  
    return (mod < 2 ? 0 : 11 - mod)
 }


    validate(value: any, args: ValidationArguments) {
        console.log(value);
        const stripped: string = this.strip(value)

        // CPF must be defined
        if (!stripped) {
            return false
        }

        // CPF must have 11 chars
        if (stripped.length !== 11) {
            return false
        }

        // CPF can't be blacklisted
        if (this.BLACKLIST.includes(stripped)) {
            return false
        }

        let numbers: string = stripped.substr(0, 9)
        numbers += this.verifierDigit(numbers)
        numbers += this.verifierDigit(numbers)

        return numbers.substr(-2) === stripped.substr(-2)
     }

}

