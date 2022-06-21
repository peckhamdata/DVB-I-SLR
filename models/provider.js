const { create } = require('xmlbuilder2');
const { DataTypes, Model, Op } = require('sequelize');

class Provider extends Model {

  render(format) {
    let obj
    let names = []
    this.Names.forEach((name) => {
      names.push(name.render())
    })

    obj = {
      'Provider': {
        'Name': names,
        'ElectronicAddress': {
          'mpeg7:Telephone': this.ElectronicAddress.Telephone,
          'mpeg7:Email': this.ElectronicAddress.Email
        }
      }
    } 
    
    const address = this.Address.render()
    obj['Provider']['Address'] = address.Address
    if (format === 'xml') {
      const re = create(obj)
      return re.end({prettyPrint: true});
    }
    return obj;

  }

}

class Name extends Model {

  render(format) {
    return {'@xml:lang': this.lang, '#': this.Name}
  }

}

class Address extends Model {

  render(format) {
  let address_lines = []

  let last_line = 999
  this.Lines.forEach((line) => {
    if (line.LineNumber < last_line) {
      address_lines.unshift(line.Text)
    } else {
      address_lines.push(line.Text)
    }
    last_line = line.LineNumber
  })
  
      return {'Address': {
        'mpeg7:Name': this.Name,
        'mpeg7:PostalAddress': {
          'mpeg7:AddressLine': address_lines}
      }
    }
  }
}

class Line extends Model {

}

class ElectronicAddress extends Model {

}

function init_provider_models(sequelize) {

  Provider.init({
    GUID: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Provider'
  });

  Name.init({
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Lang: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Name'
  });

  Name.Provider = Name.belongsTo(Provider)
  Provider.Name = Provider.hasMany(Name);


  Address.init({
    Name: {
      type: DataTypes.STRING,
      allowNull: false
    }
    }, {
    sequelize,
    modelName: 'Address'
  });

  Address.Provider = Provider.belongsTo(Provider)
  Provider.Address = Provider.hasOne(Address);

  Line.init({
    LineNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Text: {
      type: DataTypes.STRING,
      allowNull: false
    }
    }, {
    sequelize,
    modelName: 'Line'
  });

  Line.Address = Line.belongsTo(Address)
  Address.Lines = Address.hasMany(Line);

  ElectronicAddress.init({
    Telephone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ElectronicAddress'
  });

  ElectronicAddress.Provider = ElectronicAddress.belongsTo(Provider)
  Provider.ElectronicAddress = Provider.hasOne(ElectronicAddress);

}

module.exports = {Provider, Name, Address, Line, ElectronicAddress, init_provider_models};
