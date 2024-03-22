import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import More from './More';
import PokemonListCard from './PokemonListCard';
import getWeakAgainstPokemons from '../utils/getWeakAgainstPokemons';
import getStrongAgainstPokemons from '../utils/getStrongAgainstPokemons';
import findClosestMatch from '../utils/findClosestMatch';
import { Pokemon } from '../types';

type Props = {
  pokemon: Pokemon;
  navigation: any;
};

function PokemonMatches({ pokemon, navigation }: Props) {
  const [containerWidth, setContainerWidth] = useState(
    Dimensions.get('window').width
  );

  const onStrongPress = () => {
    navigation.push('StrongAgainst', {
      pokemonId: pokemon.id,
    });
  };

  const onWeakPress = () => {
    navigation.push('WeakAgainst', {
      pokemonId: pokemon.id,
    });
  };

  const onLayout = (e: LayoutChangeEvent) => {
    if (containerWidth === e.nativeEvent.layout.width) {
      return;
    }

    setContainerWidth(e.nativeEvent.layout.width);
  };

  const weakAgainstPokemons = getWeakAgainstPokemons(pokemon);
  const strongAgainstPokemons = getStrongAgainstPokemons(pokemon);

  const strongAgainstFirst: Pokemon | undefined = strongAgainstPokemons.length
    ? findClosestMatch(strongAgainstPokemons, pokemon, false)
    : undefined;

  const weakAgainstFirst: Pokemon | undefined = weakAgainstPokemons.length
    ? findClosestMatch(weakAgainstPokemons, pokemon)
    : undefined;

  const cardStyle = {
    width: (containerWidth - 8) / Math.floor(containerWidth / 160) - 8,
    margin: 4,
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      onLayout={onLayout}
    >
      {strongAgainstFirst && (
        <View>
          <Text style={styles.heading}>
            Strong against ({strongAgainstPokemons.length})
          </Text>
          <View style={styles.row}>
            <PokemonListCard
              pokemon={strongAgainstFirst}
              navigation={navigation}
              style={cardStyle}
            />
            {strongAgainstPokemons.length > 1 && (
              <More onPress={onStrongPress} style={cardStyle} />
            )}
          </View>
        </View>
      )}

      {weakAgainstFirst && (
        <View>
          <Text style={styles.heading}>
            Weak against ({weakAgainstPokemons.length})
          </Text>
          <View style={styles.row}>
            <PokemonListCard
              pokemon={weakAgainstFirst}
              navigation={navigation}
              style={cardStyle}
            />
            {weakAgainstPokemons.length > 1 && (
              <More onPress={onWeakPress} style={cardStyle} />
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
  },

  content: {
    padding: 4,
  },

  heading: {
    color: '#000',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 11,
    opacity: 0.5,
    margin: 4,
    marginTop: 16,
    backgroundColor: 'transparent',
  },

  row: {
    flexDirection: 'row',
  },
});

export default PokemonMatches;
