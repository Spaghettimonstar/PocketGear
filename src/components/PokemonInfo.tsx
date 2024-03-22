import type { StaticScreenProps } from '@react-navigation/native';
import find from 'lodash/find';
import React, { useCallback } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { PokemonProvider } from '../contexts/PokemonContext';
import store from '../store';
import type { PokemonID } from '../types';
import Appbar from './Appbar';
import NoResults from './NoResults';
import PokemonTypeLabel from './PokemonTypeLabel';

type Props = StaticScreenProps<{ pokemonId: PokemonID }> & {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

function PokemonInfo({ route, children, style, ...rest }: Props) {
  const getPokemon = useCallback((id: PokemonID) => {
    const pokemons = store.getPokemons();
    const pokemon = find(pokemons, { id });
    return pokemon;
  }, []);

  const pokemon = getPokemon(route.params.pokemonId);
  const sprite = store.getSprite(route.params.pokemonId);

  if (pokemon === undefined) {
    return (
      <NoResults
        source={require('../../assets/images/open-pokeball.png')}
        label="Pokemon not found"
      />
    );
  }

  return (
    <View {...rest} style={[styles.container, style]}>
      <Appbar style={styles.appbar}>{'#' + pokemon.id}</Appbar>
      <View style={[styles.row, styles.meta]}>
        <View style={styles.basic}>
          <Text style={[styles.label, styles.name]}>{pokemon.name}</Text>
          <View style={styles.types}>
            {pokemon.types.map((type) => (
              <PokemonTypeLabel key={type} type={type} />
            ))}
          </View>
        </View>
        <Image style={styles.image} source={sprite} />
      </View>
      <PokemonProvider value={pokemon}>{children}</PokemonProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  appbar: {
    elevation: 0,
    borderBottomWidth: 0,
    shadowOpacity: 0,
  },

  image: {
    marginHorizontal: 8,
    height: 72,
    resizeMode: 'contain',
  },

  label: {
    color: '#222',
    fontFamily: 'Montserrat',
    width: 160,
  },

  name: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    marginVertical: 4,
  },

  types: {
    flexDirection: 'row',
    marginHorizontal: -2,
  },

  row: {
    flexDirection: 'row',
    marginVertical: 4,
  },

  meta: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  basic: {
    flex: 1,
  },
});

export default PokemonInfo;
