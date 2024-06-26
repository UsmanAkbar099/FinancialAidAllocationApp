import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView } from 'react-native';
import { BASE_URL } from './config';

const Addbudget = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [filteredFacultyMembers, setFilteredFacultyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  useEffect(() => {
    // Fetch data from API
    fetchData();
    fetchTotalAmount();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Admin/BudgetHistory`);
      const data = await response.json();
      console.log('Fetched data:', data); // Ensure data is fetched successfully
      setFacultyMembers(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError(error);
      setIsLoading(false);
    }
  };

  const fetchTotalAmount = async () => {
    try {
      const response = await fetch(`${BASE_URL}/FinancialAidAllocation/api/Committee/GetBalance`);
      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data); // Log the response data
        setTotalAmount(data); // Set the total amount
      } else {
        console.error('Failed to fetch total amount:', response.statusText);
        setTotalAmount(null);
      }
    } catch (error) {
      console.error('Error fetching total amount:', error);
      setTotalAmount(null);
    }
  };

  useEffect(() => {
    // Filter faculty members based on search query
    const filteredMembers = facultyMembers.filter(member =>
      member.budget_session && member.budget_session.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFacultyMembers(filteredMembers);
  }, [searchQuery, facultyMembers]);

  const renderFacultyMember = ({ item }) => {
    if (!item || !item.budgetAmount || !item.budget_session) {
      return null; // Return null if item, budgetAmount, or budget_session is undefined
    }

    return (
      <View style={styles.facultyMemberContainer}>
        <View>
          <Text style={styles.facultyMemberTexts}>Budget Amount: {item.budgetAmount}</Text>
          <Text style={styles.facultyMemberText}>Budget Session: {item.budget_session}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  const handleAddIconPress = () => {
    // Handle add icon press action
    props.navigation.navigate('AddBudgetScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>BUDGET History</Text>
        <TouchableOpacity onPress={handleAddIconPress}>
          <Image source={require('./Add.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.frombox}>
        <Text style={styles.wel}>Remaining Amount</Text>
        <Text style={styles.wels}>{totalAmount !== null ? totalAmount : 'Loading...'}</Text>
      </View>
      <View style={styles.searchBarContainer}>
        <Image source={require('./Search.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search budget for session"
          placeholderTextColor="black"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <FlatList
        data={filteredFacultyMembers}
        renderItem={renderFacultyMember}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#82b7bf',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  frombox: {
    backgroundColor: '#fff',
    padding: 20,
    height: '20%',
    width: '100%',
    borderBottomWidth: 1,
    marginBottom: 10,
    borderRadius: 30,
    marginTop: 1,
  },
  wel: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
    marginLeft: 50,
  },
  wels: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'green',
    marginLeft: 100,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  name: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingVertical: 1,
    color: 'red',
    fontSize: 24,
    marginTop: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    color: 'black',
  },
  facultyMemberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  facultyMemberText: {
    fontSize: 18,
    color: 'black',
  },
  facultyMemberTexts: {
    fontSize: 25,
    color: 'green',
  },
});

export default Addbudget;
