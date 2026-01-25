export const SetMetaData = (key: string, value: any): MethodDecorator => {
  return function (target: any, propertyKey: string | symbol) {
    if (!target.methods) {
      target.methods = [];
      const data = {
        handler: propertyKey
      };
      data[key] = value;
      target.methods.push(data);
    } else {
      const newMethods = [];
      let include = false;
      for (const r of target.methods) {
        if (r.handler == propertyKey) {
          r[key] = value;
          include = true;
        }
        newMethods.push(r);
      }
      if (!include) {
        const data = {
          handler: propertyKey
        };
        data[key] = value;
        newMethods.push(data);
      }
      target.methods = newMethods;
    }
  };
};
